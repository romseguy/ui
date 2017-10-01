import { call, fork, put, select, take } from 'redux-saga/effects'

import { query } from 'helpers/apollo'
import { personToNode, placeToNode } from 'lib/factories'

import { canvasActions } from 'core/canvas'
import { mapActions } from 'core/map'

import placeQuery from 'graphql/queries/place.query.graphql'
import placesQuery from 'graphql/queries/places.query.graphql'
import userQuery from 'graphql/queries/user.query.graphql'


export function* setNodesFromPlaceSaga(client, placeTitle) {
  yield put(canvasActions.setNodesLoading(true))

  const {place} = yield call(query, client, {
    query: placeQuery,
    variables: {title: placeTitle}
  }, {
    cache: false,
    from: 'setNodesFromPlaceSaga'
  })

  yield put(canvasActions.setNodes(place.users.map((person, nodeId) => personToNode(nodeId, person))))
  yield put(canvasActions.setNodesLoading(false))
}

export function* setNodesFromPlacesSaga(client) {
  yield put(mapActions.setNodesLoading(true))

  const {places} = yield call(query, client, {query: placesQuery}, {
    from: '/',
    cache: true
  })

  yield put(mapActions.setNodes(places.map((place, nodeId) => placeToNode(nodeId, place))))
  yield put(mapActions.setNodesLoading(false))
}

export function* setNodesFromUserSaga(client, username) {
  yield put(canvasActions.setNodesLoading(true))

  const {user} = yield call(query, client, {
    query: userQuery,
    variables: {username}
  }, {
    cache: true,
    from: 'setNodesFromUserSaga'
  })

  yield put(canvasActions.setNodes(user.places.map((place, nodeId) => placeToNode(nodeId, place))))
  yield put(canvasActions.setNodesLoading(false))
}
