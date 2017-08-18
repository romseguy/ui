import { merge, set } from 'zaphod/compat'
import { authActions } from './auth.actions'


export const AuthState = {
  isAuthed: null
}


export function authReducer(state = AuthState, {payload, type}) {
  switch (type) {
    // ACTIONS
    case authActions.SET_IS_AUTHED:
      return set(state, 'isAuthed', payload.isAuthed)

    // SAGA EVENTS
    // UI EVENTS

    default:
      return state
  }
}
