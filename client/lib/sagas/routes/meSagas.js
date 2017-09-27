import { call, put, select } from 'redux-saga/effects'

import { canvasActions } from 'core/canvas'
import { routerActions } from 'core/router'

import { query } from 'helpers/apollo'
import { userPlaceToNode } from 'lib/factories'
import { setTitleSaga } from 'lib/sagas'

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
  const {client, i18n, onEnter, prevRoute} = settings

  if (onEnter || ![
      routerActions.ME_PLACE_EDIT,
      routerActions.ME_PLACES_ADD
    ].includes(prevRoute.type)) {
    yield call(setNodesFromMyPlacesSaga, client)
  }

  yield call(setTitleSaga, i18n.t('my_profile'), {i18n: true})
}

export function* mePlaceEditSaga(payload, settings) {
  const {client, i18n, onEnter, prevRoute} = settings
  const {placeTitle} = payload

  if (onEnter || ![
      routerActions.ME,
      routerActions.ME_PLACES_ADD
    ].includes(prevRoute.type)) {
    yield call(setNodesFromMyPlacesSaga, client, placeTitle)
  }

  yield call(setTitleSaga, `${i18n.t('form:place.title_edit')} ${placeTitle}`, {i18n: true})
}

export function* mePlacesAddSaga(payload, settings) {
  const {client, i18n, onEnter, prevRoute} = settings

  if (onEnter || ![
      routerActions.ME
    ].includes(prevRoute.type)) {
    yield call(setNodesFromMyPlacesSaga, client)
  }

  yield call(setTitleSaga, i18n.t('form:place.title_add'), {i18n: true})
}

export function* meSymbolsAddSaga(payload, settings) {
  const {name: symbolType} = payload
  const {currentRoute} = settings

  if (!currentRoute.allowedSymbolTypes.includes(symbolType.toUpperCase())) {
    yield put(routerActions.meRoute())
  }
}
