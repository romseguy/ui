const createLatLngObject = (lat, lng) => {
  return new google.maps.LatLng(lat, lng)
}

export const computeDistanceBetween = (p1, p2) => {
  return (
    google.maps.geometry.spherical.computeDistanceBetween(
      createLatLngObject(p1.lat, p1.lng),
      createLatLngObject(p2.lat, p2.lng)
    ) / 1000
  ).toFixed(1)
}
