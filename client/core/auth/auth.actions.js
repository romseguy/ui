export const authActions = {
  // ACTIONS
  SET_IS_AUTHED: 'SET_IS_AUTHED',

  setIsAuthed: isAuthed => ({
    type: authActions.SET_IS_AUTHED,
    payload: {isAuthed}
  }),

  // SAGA EVENTS
  // UI EVENTS
}
