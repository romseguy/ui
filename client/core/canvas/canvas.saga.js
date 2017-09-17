import { channel } from 'redux-saga'
import { all, call, fork, getContext, put, select, take, takeEvery } from 'redux-saga/effects'

import { mutate } from 'helpers/apollo'
import entityTypes from 'lib/maps/entityTypes'

import { canvasActions } from 'core/canvas'
import { modalActions, modalConstants } from 'core/modal'

import deletePlaceMutation from 'graphql/mutations/deletePlace.mutation.graphql'
import deleteUserPlaceMutation from 'graphql/mutations/deleteUserPlace.mutation.graphql'


function* deleteServerNodeSaga({payload}) {
  const client = yield getContext('client')
  const i18n = yield getContext('i18n')

  if (payload.node.type === entityTypes.PLACE) {
    if (payload.node.mine) {
      const options = [{
        label: i18n.t('canvas:confirm.delete_place.options.both.label'),
        labels: [
          i18n.t('canvas:confirm.delete_place.options.both.labels.0'),
          i18n.t('canvas:confirm.delete_place.options.both.labels.1'),
        ],
        submitIconName: 'warning sign',
        submitLabel: i18n.t('canvas:confirm.delete_place.options.both.submit_label', {name: payload.node.name}),
      }, {
        label: i18n.t('canvas:confirm.delete_place.options.only.label'),
        submitIconName: 'checkmark',
        submitLabel: i18n.t('canvas:confirm.delete_place.options.only.submit_label')
      }]

      const onConfirmChannel = channel()
      const modalComponentProps = {
        content: i18n.t('canvas:confirm.delete_place.content', {name: payload.node.name}),
        options,
        title: i18n.t('canvas:confirm.delete_place.title'),
        onConfirm: deleteBoth => onConfirmChannel.put({deleteBoth})
      }

      yield put(modalActions.setModal(modalConstants.CONFIRM_DELETE_PLACE, modalComponentProps, {
        basic: true,
        open: true
      }))

      // onConfirm callback
      const {deleteBoth} = yield take(onConfirmChannel)
      onConfirmChannel.close()

      const effects = [
        call(mutate, client, {
          mutation: deleteUserPlaceMutation,
          variables: {
            placeId: Number(payload.node.idServer)
          }
        })
      ]

      if (deleteBoth) {
        effects.push(call(mutate, client, {
          mutation: deletePlaceMutation,
          variables: {
            placeId: Number(payload.node.idServer)
          }
        }))
      }

      yield all(effects)
      yield put(canvasActions.removeNode(payload.node))

      yield put(modalActions.setModal(modalConstants.CONFIRM_DELETE_PLACE, {}, {open: false}))

      // todo: display toast with rollback option
    }
    else {
      const deletedUserPlace = yield call(mutate, client, {
        mutation: deleteUserPlaceMutation,
        variables: {
          placeId: Number(payload.node.idServer)
        }
      })

      yield put(canvasActions.removeNode(payload.node))

      // todo: display toast with rollback option
    }
  }
}

export function* canvasSaga() {
  yield all([
    takeEvery(canvasActions.DELETE_SERVER_NODE, deleteServerNodeSaga)
  ])
}
