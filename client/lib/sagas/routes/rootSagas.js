import { call, getContext, put, select, take } from 'redux-saga/effects'

import { query } from 'helpers/apollo'
import { personToNode } from 'lib/factories'
import setDepartmentTitleSaga from 'lib/sagas/setDepartmentTitle.saga'
import setTitleSaga from 'lib/sagas/setTitle.saga'

import { canvasActions } from 'core/canvas'
import { modalActions, modalConstants } from 'core/modal'
import { routerActions } from 'core/router'

import placeQuery from 'graphql/queries/place.query.graphql'
import logoutMutation from 'graphql/mutations/logout.mutation.graphql'


export function* rootSaga(payload, settings) {
  const {} = settings

  yield call(setDepartmentTitleSaga)
}

export function* aboutSaga(payload, settings) {
  const i18n = yield getContext('i18n')
  yield call(setTitleSaga, i18n.t('about'), {i18n: true})
}

export function* authSaga(payload, settings) {
  const {currentUser} = settings

  if (currentUser) {
    yield put(routerActions.rootRoute())
  } else {
    yield put(modalActions.setModal(modalConstants.AUTH, {
      isOpen: true,
      modalProps: {
        size: 'small',
        basic: true,
        closeOnRootNodeClick: false
      }
    }))
  }

  yield call(setDepartmentTitleSaga)
}

export function* logoutSaga(payload, settings) {
  const {currentUser} = settings
  const client = yield getContext('client')

  if (currentUser) {
    yield call([client, client.mutate], {
      mutation: logoutMutation
    })
  }

  yield put(routerActions.rootRoute())
}

export function* placeViewSaga(payload, settings) {
  const {name: placeName} = payload
  const {prevRouteType} = settings
  const i18n = yield getContext('i18n')

  if (![].includes(prevRouteType)) {
    const client = yield getContext('client')
    const {place} = yield call(query, {client, query: placeQuery, variables: {title: placeName}}, {cache: true, from: '/place/view'})
    yield put(canvasActions.setNodes(place.users.map((person, nodeId) => personToNode(nodeId, person))))
  }

  yield call(setTitleSaga, `${placeName}`)
}

export function* userViewSaga(payload, settings) {
  const {name: username, noReset} = payload
  const {} = settings
  const i18n = yield getContext('i18n')

  yield call(setTitleSaga, `${username}`)
}

export function* notFoundSaga() {
  yield call(setDepartmentTitleSaga)
}
