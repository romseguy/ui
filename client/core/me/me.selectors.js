import { createSelector } from 'reselect'

export function getMe(state) {
  return state.me
}

export function getMeCenter(state) {
  return getMe(state).center
}
export function getMeCentre(state) {
  return getMe(state).centre
}
