function getForm(state) {
  return state.form
}

function getPlaceForm(state) {
  return getForm(state).PlaceForm || {}
}

export function getPlaceFormValues(state) {
  return getPlaceForm(state).values || {}
}

function getAuthForm(state) {
  return getForm(state).AuthForm || {}
}

export function getAuthFormValues(state) {
  return getAuthForm(state).values || {}
}
