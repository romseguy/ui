export const placesActions = {
  // ACTIONS
  CREATE_PICTURE: 'CREATE_PICTURE',
  UPDATE_PLACE: 'UPDATE_PLACE',

  createPicture: file => ({
    type: placesActions.CREATE_PICTURE,
    payload: {file}
  }),

  updatePlace: (place) => ({
    type: placesActions.UPDATE_PLACE,
    payload: {place}
  }),

  // SAGA EVENTS
  LOAD_PLACES_FULFILLED: 'LOAD_PLACES_FULFILLED',
  UPDATE_PLACE_FAILED: 'UPDATE_PLACE_FAILED',
  UPDATE_PLACE_FULFILLED: 'UPDATE_PLACE_FULFILLED',

  updatePlaceFailed: place => ({
    type: placesActions.UPDATE_PLACE_FAILED,
    payload: {place}
  }),

  updatePlaceFulfilled: place => ({
    type: placesActions.UPDATE_PLACE_FULFILLED,
    payload: {place}
  }),

  // UI EVENTS
}
