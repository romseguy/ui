import { roleTypes } from 'core/constants'

import { atomTypes } from 'views/utils/atoms'
import { atoms, entities } from 'views/assets/img'


export const personToNode = (id, person) => {
  const {
    username,
    x,
    y
  }= person

  return {
    // identifiers
    id,
    idServer: Number(person.id),
    type: atomTypes.PERSON,

    // state
    name: username,
    x: x ? parseFloat(x) : (id + 1) * 100,
    y: y ? parseFloat(y) : (id + 1) * 100,

    // options
    titleYOffset: 50,
    height: 100,
    width: 50,

    // images
    image: atoms.yellow,
    imageSelected: atoms.yellow_selected,
    imageHeight: 50,
    imageWidth: 50
  }
}

export const placeToNode = (id, place, {mine = false} = {}) => {
  const {
    distance,
    latitude,
    longitude,
    title: name,
    x,
    y,
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

export const userPlaceToLocationNode = (id, userPlace) => {
  const {
    place,
    role: {
      id: roleId
    },
    x,
    y,
  } = userPlace

  const mine = roleId === roleTypes.GUARDIAN

  return placeToNode(id, {...place, x, y}, {mine})
}
