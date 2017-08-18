export const meActions = {
  // ACTIONS
  SET_CENTRE: 'SET_CENTRE',

  setCentre: (centre, params = {}) => ({
    type: meActions.SET_CENTRE,
    payload: {centre, params}
  }),

  // SAGA EVENTS
}
