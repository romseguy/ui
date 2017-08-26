import { delay } from 'redux-saga'
import { select } from 'redux-saga/effects'

function getCanvas(state) {
  return state.canvas
}

export function getCanvasNodes(state) {
  return getCanvas(state).nodes
}

export function* getCanvasNodesSaga() {
  let keepLooping = true

  while (keepLooping) {
    const nodes = yield select(getCanvasNodes)

    if (nodes.length) {
      keepLooping = false
      return nodes
    }

    yield delay(100)
  }
}

export function getSelectedNodeIds(state) {
  return getCanvas(state).selectedNodeIds
}
