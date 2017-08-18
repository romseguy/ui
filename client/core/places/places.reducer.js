import { set, push, merge, setIn, update, updateIn } from 'zaphod/compat'

import { placesActions } from './places.actions'


export const PlacesState = {
}

export function placesReducer(state = PlacesState, {payload, type}) {
  switch (type) {
    // ACTIONS

    // SAGA EVENTS

    // UI EVENTS

    default:
      return state
  }
}
