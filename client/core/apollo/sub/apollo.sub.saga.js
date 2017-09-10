import { call, put, select } from 'redux-saga/effects'
import { canvasActions, getCanvasNodes } from 'core/canvas'

import { personToNode, userPlaceToLocationNode } from 'views/utils/transformers'


export function* mergePlaceIntoPersonNodesSaga(place = {users:[]}) {
  const nodes = yield select(getCanvasNodes)

  let currentNodeId = nodes.length - 1
  const mergedNodes = place.users
    .map(person => {
      currentNodeId = currentNodeId + 1
      return personToNode(currentNodeId, person)
    })
    .concat(nodes)

  yield put(canvasActions.setNodes(mergedNodes))
}

export function* mergeUserPlacesIntoLocationNodesSaga(userPlaces) {
  const nodes = yield select(getCanvasNodes)

  let currentNodeId = nodes.length - 1
  const mergedNodes = userPlaces
    .map(userPlace => {
      currentNodeId = currentNodeId + 1
      return userPlaceToLocationNode(currentNodeId, userPlace)
    })
    .concat(nodes)

  yield put(canvasActions.setNodes(mergedNodes))
}
