import { merge, set, setIn, updateIn, push } from 'zaphod/compat'

import { mainPanelActions } from './mainPanel.actions'

export const MainPanelState = {
  canvas: {
    nodes: [],
    selectedNodeId: null
  },
  sidePanel: {
    isOpen: false
  }
}


export function mainPanelReducer(state = MainPanelState, {payload, type}) {
  switch (type) {
    // ACTION
    case mainPanelActions.SET_MAIN_PANEL_SELECTED_NODE_ID:
      state = setIn(state, ['canvas', 'selectedNodeId'], payload.selectedNodeId)
      state = updateIn(state, ['canvas', 'nodes'], nodes => nodes.map(node => {
          if (node.id === payload.selectedNodeId) {
            return {...node, selected: true}
          }
          return {...node, selected: false}
        })
      )
      return state

    case mainPanelActions.SET_MAIN_PANEL_NODES:
      return setIn(state, ['canvas', 'nodes'], payload.nodes)

    case mainPanelActions.SET_MAIN_PANEL_NODE:
      return updateIn(state, ['canvas', 'nodes'], nodes => nodes.map(node => {
          if (node.id === payload.node.id) {
            return payload.node
          }

          return node
        })
      )

    case mainPanelActions.ADD_MAIN_PANEL_NODE:
      return updateIn(state, ['canvas', 'nodes'], nodes => nodes::push({
        ...payload.node,
        id: nodes.length
      }))


    case mainPanelActions.UPDATE_MAIN_PANEL_NODE:
      return updateIn(state, ['canvas', 'nodes'], nodes => nodes.map(node => {
        if (node.id === payload.id) {
          return {...node, ...payload.attrs}
        }

        return node
      }))

    case mainPanelActions.REMOVE_MAIN_PANEL_NODE:
      return updateIn(state, ['canvas', 'nodes'], nodes => nodes.filter(node => node.key !== payload.key))

    case mainPanelActions.OPEN_MAIN_PANEL_SIDE_PANEL:
      return setIn(state, ['sidePanel', 'isOpen'], true)

    case mainPanelActions.CLOSE_MAIN_PANEL_SIDE_PANEL:
      return setIn(state, ['sidePanel', 'isOpen'], false)

    // SAGA EVENTS

    // UI EVENTS

    default:
      return state
  }
}
