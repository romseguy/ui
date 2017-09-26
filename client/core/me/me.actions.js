export const meActions = {
  REFETCH_CURRENT_USER: 'REFETCH_CURRENT_USER',
  SET_CURRENT_USER: 'SET_CURRENT_USER',

  setCurrentUser: currentUser => ({
    type: meActions.SET_CURRENT_USER,
    payload: {currentUser}
  })
}
