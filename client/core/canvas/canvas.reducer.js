import R from 'ramda'
import { merge, set, setIn, updateIn, push } from 'zaphod/compat'

import { canvasActions } from './canvas.actions'

export const canvasState = {
  nodes: [],
  selectedNodeIds: []
}


export function canvasReducer(state = canvasState, {payload, type}) {
  switch (type) {
    // ACTION
    case canvasActions.ADD_NODE:
      return updateIn(state, ['nodes'], nodes => nodes::push({
        ...payload.node,
        id: nodes.length
      }))

    case canvasActions.REMOVE_NODE:
      return updateIn(state, ['nodes'], nodes => nodes.filter(node => node.key !== payload.key))

    case canvasActions.SELECT_NODE:
    case canvasActions.SELECT_NODES:
      state = updateIn(state, ['selectedNodeIds'], selectedNodeIds => {
        return R.unionWith(R.equals, selectedNodeIds, payload.selectedNodeIds)
      })

      state = updateIn(state, ['nodes'], nodes => nodes.map(node => {
          if (payload.selectedNodeIds.includes(node.id)) {
            return {...node, selected: true}
          }
          return node
        })
      )

      return state

    case canvasActions.SET_NODE:
      return updateIn(state, ['nodes'], nodes => nodes.map(node => {
          if (node.id === payload.node.id) {
            return payload.node
          }

          return node
        })
      )
    case canvasActions.SET_NODES:
      return setIn(state, ['nodes'], payload.nodes)

    case canvasActions.UNSELECT_NODE:
    case canvasActions.UNSELECT_NODES:
      state = updateIn(state, ['selectedNodeIds'], selectedNodeIds => {
        return selectedNodeIds.filter(selectedNodeId => !payload.unselectedNodeIds.includes(selectedNodeId))
      })

      state = updateIn(state, ['nodes'], nodes => nodes.map(node => {
        if (payload.unselectedNodeIds.includes(node.id)) {
          return {...node, selected: false}
        }
        return node
      }))

      return state

    case canvasActions.UPDATE_NODE:
      return updateIn(state, ['nodes'], nodes => nodes.map(node => {
        if (node.id === payload.id) {
          return {...node, ...payload.attrs}
        }

        return node
      }))

    // SAGA EVENTS

    // UI EVENTS

    default:
      return state
  }
}
