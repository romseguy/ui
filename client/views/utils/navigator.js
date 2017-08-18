/**
 * @param e touch or mouse event
 * @returns {{clientX, clientY}} client coordinates
 */
export const getClientPosition = e => {
  const {clientX, clientY} = e.clientX !== undefined ? e : e.changedTouches[0]
  return {clientX, clientY}
}

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => resolve(position), error => reject(error), {
      enableHighAccuracy: true
    })
  })
}

export const getCurrentPositionErrorCodes = {
  USER_DENIED_GEOLOCATION: 1,
  USER_IS_OFFLINE: 2
}
