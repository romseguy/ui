function getForm(state) {
  return state.form
}

function getPlaceForm(state) {
  return getForm(state).PlaceForm || {}
}

export function getPlaceFormValues(state) {
  return getPlaceForm(state).values || {}
}
