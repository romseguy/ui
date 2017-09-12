import { set, push, update } from 'zaphod/compat'
import centreTypes from 'lib/maps/centreTypes'
import { meActions } from './me.actions'


export const MeState = {
  center: [],
  centre: centreTypes.DEPARTMENT
}

export function meReducer(state = MeState, {payload, type}) {
  switch (type) {
    case meActions.SET_CENTER:
      return set(state, 'center', payload.center)

    case meActions.SET_CENTRE:
      return set(state, 'centre', payload.centre)

    default:
      return state
  }
}
