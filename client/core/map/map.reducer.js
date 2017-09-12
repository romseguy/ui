import { set, push, update } from 'zaphod/compat'
import { mapActions } from './map.actions'


export const MeState = {
  center: []
}

export function mapReducer(state = MeState, {payload, type}) {
  switch (type) {
    case mapActions.SET_MAP_CENTER:
      return set(state, 'center', payload.center)

    default:
      return state
  }
}
