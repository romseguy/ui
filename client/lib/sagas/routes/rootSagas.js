import { call, put, select, take } from 'redux-saga/effects'

import { query } from 'helpers/apollo'
import { personToNode, placeToNode } from 'lib/factories'
import setDepartmentTitleSaga from 'lib/sagas/setDepartmentTitle.saga'
import setTitleSaga from 'lib/sagas/setTitle.saga'

import { canvasActions } from 'core/canvas'
import { mapActions } from 'core/map'
import { modalActions, modalConstants } from 'core/modal'
import { routerActions } from 'core/router'

import placeQuery from 'graphql/queries/place.query.graphql'
import placesQuery from 'graphql/queries/places.query.graphql'
import logoutMutation from 'graphql/mutations/logout.mutation.graphql'


export function* rootSaga(payload, settings) {
  const {client, prevRouteType} = settings

  if (![routerActions.ROOT].includes(prevRouteType)) {
    const {places} = yield call(query, {client, query: placesQuery}, {from: '/'})
    yield put(mapActions.setNodes(places.map((place, nodeId) => placeToNode(nodeId, place))))
  }

  yield call(setDepartmentTitleSaga)
}

export function* aboutSaga(payload, settings) {
  const {i18n} = settings
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
  const {currentUser, client} = settings

  if (currentUser) {
    yield call([client, client.mutate], {
      mutation: logoutMutation
    })
  }

  yield put(routerActions.rootRoute())
}

export function* placeViewSaga(payload, settings) {
  const {name: placeName} = payload
  const {client, prevRouteType} = settings

  if (![].includes(prevRouteType)) {
    const {place} = yield call(query, {client, query: placeQuery, variables: {title: placeName}}, {
      cache: true,
      from: '/place/view'
    })
    yield put(canvasActions.setNodes(place.users.map((person, nodeId) => personToNode(nodeId, person))))
  }

  yield call(setTitleSaga, `${placeName}`)
}

export function* userViewSaga(payload, settings) {
  const {name: username} = payload
  const {i18n} = settings

  yield call(setTitleSaga, `${username}`)
}

export function* notFoundSaga() {
  yield call(setDepartmentTitleSaga)
}
