import geo from 'utils/api/geo'
import { getGeocodedDepartment, getGeocodedLocation } from 'utils/geo'

import { atomTypes } from 'views/utils/atoms'
import { entities } from 'views/assets/img'


export async function formValuesToPlace(formValues) {
  let place = {
    city: formValues.city,
    department: formValues.department,
    latitude: formValues.marker && formValues.marker[0],
    longitude: formValues.marker && formValues.marker[1],
    title: formValues.title,
  }

  let geocodingResult = null

  if (!place.latitude || !place.longitude) {
    geocodingResult = await geo.geocodeCity(formValues.city)

    const {lat, lng} = getGeocodedLocation(geocodingResult)

    place = {
      ...place,
      latitude: lat,
      longitude: lng
    }
  }

  if (!place.department) {
    if (!geocodingResult) {
      geocodingResult = await geo.geocodeCity(formValues.city)
    }

    place = {
      ...place,
      department: getGeocodedDepartment(geocodingResult)
    }
  }

  return place
}

export const placeToNode = (id, place, {mine = false, x, y} = {}) => {
  const {
    distance,
    latitude,
    longitude,
    title: name
  } = place

  return {
    // identifiers
    id,
    idServer: Number(place.id),
    type: atomTypes.LOCATION,

    // state
    distance,
    latitude,
    longitude,
    mine,
    name,
    selected: false,
    x: x ? parseFloat(x) : (id + 1) * 100,
    y: y ? parseFloat(y) : (id + 1) * 100,

    // options
    backgroundColor: 'transparent',
    height: 100,
    textColor: 'black',
    titleYOffset: 50,
    width: 50,

    // images
    image: entities.place,
    imageSelected: entities.place_selected,
    imageHeight: 50,
    imageWidth: 50
  }
}
