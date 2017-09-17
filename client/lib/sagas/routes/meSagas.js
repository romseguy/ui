import { call, put, select } from 'redux-saga/effects'

import { canvasActions } from 'core/canvas'
import { routerActions } from 'core/router'

import { query } from 'helpers/apollo'
import { userPlaceToNode } from 'lib/factories'
import setTitleSaga from 'lib/sagas/setTitle.saga'

import myPlacesQuery from 'graphql/queries/myPlaces.query.graphql'


function* setNodesFromMyPlacesSaga(client, selectedPlaceTitle) {
  yield put(canvasActions.setNodesLoading(true))
  const {myPlaces} = yield call(query, {client, query: myPlacesQuery}, {from: '/me'})

  let nodes = myPlaces.map((userPlace, nodeId) => userPlaceToNode(nodeId, userPlace))

  if (selectedPlaceTitle) {
    nodes = nodes.map(node => node.name === selectedPlaceTitle ? {...node, selected: true} : node)
  }

  yield put(canvasActions.setNodes(nodes))
  yield put(canvasActions.setNodesLoading(false))
}

export function* meSaga(payload, settings) {
  const {client, onEnter, prevRoute} = settings

  if (onEnter || ![
      routerActions.ME_PLACE_EDIT,
      routerActions.ME_PLACE_VIEW,
      routerActions.ME_PLACES_ADD
    ].includes(prevRoute.type)) {
    yield call(setNodesFromMyPlacesSaga, client)
  }
}

export function* mePlaceEditSaga(payload, settings) {
  const {client, i18n, onEnter, prevRoute} = settings
  const {name: placeTitle} = payload

  if (onEnter || ![
      routerActions.ME,
      routerActions.ME_PLACES_ADD
    ].includes(prevRoute.type)) {
    yield call(setNodesFromMyPlacesSaga, client, placeTitle)
  }

  // todo: 404 place
  yield call(setTitleSaga, `${i18n.t('form:place.header_edit')} ${placeTitle}`, {i18n: true})
}

export function* mePlacesAddSaga(payload, settings) {
  const {client, onEnter, prevRoute} = settings

  if (onEnter || ![
      routerActions.ME
    ].includes(prevRoute.type)) {
    yield call(setNodesFromMyPlacesSaga, client)
  }
}
