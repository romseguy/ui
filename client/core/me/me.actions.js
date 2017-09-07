export const meActions = {
  SET_CENTER: 'SET_CENTER',
  SET_CENTRE: 'SET_CENTRE',

  setCenter: (center) => ({
    type: meActions.SET_CENTER,
    payload: {center}
  }),

  setCentre: (centre, params = {}) => ({
    type: meActions.SET_CENTRE,
    payload: {centre, params}
  })
}
