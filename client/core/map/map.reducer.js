import { set, push, update } from 'zaphod/compat'
import { mapActions } from './map.actions'


export const MeState = {
  center: [],
  nodes: [],
  nodesLoading: false
}

export function mapReducer(state = MeState, {payload, type}) {
  switch (type) {
    case mapActions.SET_MAP_CENTER:
      return set(state, 'center', payload.center)

    case mapActions.SET_NODES:
      return set(state, 'nodes', payload.nodes)

    case mapActions.SET_NODES_LOADING:
      return set(state, 'nodesLoading', payload.loading)
    default:
      return state
  }
}
