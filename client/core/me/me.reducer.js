import { set, push, update } from 'zaphod/compat'
import { centres } from 'core/constants'
import { meActions } from './me.actions'


export const MeState = {
  centre: centres.DEPARTMENT
}

export function meReducer(state = MeState, {payload, type}) {
  switch (type) {

    // ACTIONS
    case meActions.SET_CENTRE:
      return set(state, 'centre', payload.centre)

    // SAGA EVENTS

    default:
      return state
  }
}
