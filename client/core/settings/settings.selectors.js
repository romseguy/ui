import { createSelector } from 'reselect'

export function getSettings(state) {
  return state.settings
}

export function getUserLocation(state) {
  return getSettings(state).user.location
}

export function getCity(state) {
  return getUserLocation(state).city
}

export function getDepartment(state) {
  return getUserLocation(state).department
}

export function getTitle(state) {
  return getSettings(state).title
}
