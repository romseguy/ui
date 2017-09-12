export const mapActions = {
  SET_MAP_CENTER: 'SET_MAP_CENTER',

  setCenter: (center) => ({
    type: mapActions.SET_MAP_CENTER,
    payload: {center}
  })
}
