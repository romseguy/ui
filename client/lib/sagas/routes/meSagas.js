import { call, getContext, put, select, take } from 'redux-saga/effects'

import { canvasActions } from 'core/canvas'
import { routerActions } from 'core/router'

import { query } from 'helpers/apollo'
import { userPlaceToNode } from 'lib/factories'
import setTitleSaga from 'lib/sagas/setTitle.saga'

import myPlacesQuery from 'graphql/queries/myPlaces.query.graphql'


function* setNodesFromMyPlacesSaga(placeName) {
  const client = yield getContext('client')
  const {myPlaces} = yield call(query, {client, query: myPlacesQuery}, {cache: true, from: '/me'})
  let nodes = myPlaces.map((userPlace, nodeId) => userPlaceToNode(nodeId, userPlace))

  if (placeName) {
    nodes = nodes.map(node => node.name === placeName ? {...node, selected: true} : node)
  }

  yield put(canvasActions.setNodes(nodes))
}

export function* meSaga(payload, settings) {
  const {prevRouteType} = settings

  if (![
    routerActions.ME_PLACE_EDIT,
    routerActions.ME_PLACE_VIEW,
    routerActions.ME_PLACES_ADD
    ].includes(prevRouteType)) {
    yield call(setNodesFromMyPlacesSaga)
  }
}

export function* mePlaceEditSaga(payload, settings) {
  const {prevRouteType} = settings
  const {name: placeName} = payload
  const i18n = yield getContext('i18n')

  if (!prevRouteType.length) {
    yield call(setNodesFromMyPlacesSaga, placeName)
  }

  // todo: 404 place
  yield call(setTitleSaga, `${i18n.t('form:place.header_edit')} ${placeName}`, {i18n: true})
}

export function* mePlacesAddSaga(payload, settings) {
  const {prevRouteType} = settings

  if (!prevRouteType.length) {
    yield call(setNodesFromMyPlacesSaga)
  }
}
