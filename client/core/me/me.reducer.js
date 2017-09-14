import { set, push, update } from 'zaphod/compat'
import centreTypes from 'lib/maps/centreTypes'
import { meActions } from './me.actions'


export const MeState = {
  center: [],
  centre: centreTypes.DEPARTMENT,
  currentUser: null
}

export function meReducer(state = MeState, {payload, type}) {
  switch (type) {
    case meActions.SET_CENTER:
      return set(state, 'center', payload.center)

    case meActions.SET_CENTRE:
      return set(state, 'centre', payload.centre)

    case meActions.SET_CURRENT_USER:
      return set(state, 'currentUser', payload.currentUser)

    default:
      return state
  }
}
