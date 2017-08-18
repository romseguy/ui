import { createSelector } from 'reselect'

function getAuth(state) {
  return state.auth
}

export function getIsAuthed(state) {
  return getAuth(state).isAuthed
}
