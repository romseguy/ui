import { createSelector } from 'reselect'

export function getMap(state) {
  return state.map
}

export function getMapCenter(state) {
  return getMap(state).center
}
