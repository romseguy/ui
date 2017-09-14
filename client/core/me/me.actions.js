export const meActions = {
  REFETCH_CURRENT_USER: 'REFETCH_CURRENT_USER',
  SET_CENTER: 'SET_CENTER',
  SET_CURRENT_USER: 'SET_CURRENT_USER',

  setCenter: (center) => ({
    type: meActions.SET_CENTER,
    payload: {center}
  }),

  setCurrentUser: currentUser => ({
    type: meActions.SET_CURRENT_USER,
    payload: {currentUser}
  })
}
