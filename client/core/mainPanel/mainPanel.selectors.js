import { delay } from 'redux-saga'
import { select } from 'redux-saga/effects'

function getMainPanel(state) {
  return state.mainPanel
}

function getCanvas(state) {
  return getMainPanel(state).canvas
}

function getSidePanel(state) {
  return getMainPanel(state).sidePanel
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

export function getCanvasNodeById(state, id) {
  return getCanvasNodes(state).find(node => node.id === Number(id))
}

export function getSelectedNodeId(state) {
  return getCanvas(state).selectedNodeId
}

export function getNextNodeId(state) {
  return getCanvasNodes(state).length
}
