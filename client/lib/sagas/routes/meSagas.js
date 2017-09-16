import { call, put, select } from 'redux-saga/effects'

import { canvasActions } from 'core/canvas'
import { routerActions } from 'core/router'

import { query } from 'helpers/apollo'
import { userPlaceToNode } from 'lib/factories'
import setTitleSaga from 'lib/sagas/setTitle.saga'

import myPlacesQuery from 'graphql/queries/myPlaces.query.graphql'


function* setNodesFromMyPlacesSaga(client, selectedPlaceTitle) {
  const {myPlaces} = yield call(query, {client, query: myPlacesQuery}, {cache: true, from: '/me'})
  let nodes = myPlaces.map((userPlace, nodeId) => userPlaceToNode(nodeId, userPlace))

  if (selectedPlaceTitle) {
    nodes = nodes.map(node => node.name === selectedPlaceTitle ? {...node, selected: true} : node)
  }

  yield put(canvasActions.setNodes(nodes))
}

export function* meSaga(payload, settings) {
  const {client, prevRoute} = settings

  if (![
    routerActions.ME_PLACE_EDIT,
    routerActions.ME_PLACE_VIEW,
    routerActions.ME_PLACES_ADD
    ].includes(prevRoute.type)) {
    yield call(setNodesFromMyPlacesSaga, client)
  }
}

export function* mePlaceEditSaga(payload, settings) {
  const {client, i18n, onEnter} = settings
  const {name: placeTitle} = payload

  if (onEnter) {
    yield call(setNodesFromMyPlacesSaga, client, placeTitle)
  }

  // todo: 404 place
  yield call(setTitleSaga, `${i18n.t('form:place.header_edit')} ${placeTitle}`, {i18n: true})
}

export function* mePlacesAddSaga(payload, settings) {
  const {client, onEnter} = settings

  if (onEnter) {
    yield call(setNodesFromMyPlacesSaga, client)
  }
}
