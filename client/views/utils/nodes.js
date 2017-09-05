import { atomTypes } from 'views/utils/atoms'
import { atoms } from 'views/assets/img'


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

    //x: x ? parseFloat(x) : 10,
    //y: y ? parseFloat(y) : 10,
    x: (id + 1) * 100,
    y: (id + 1) * 100,


    // options
    height: 100,
    image: atoms.yellow,
    imageSelected: atoms.yellow_selected,
    imageHeight: 50,
    imageWidth: 50,
    titleYOffset: 50,
    width: 50
  }
}

export const placeToNode = (id, place, mine = false) => {
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
    x: x ? parseFloat(x) : 10,
    y: y ? parseFloat(y) : 10,

    // options
    backgroundColor: 'transparent',
    height: 100,
    // images
    image: mine ? atoms.green : atoms.green,
    imageSelected: mine ? atoms.green_selected : atoms.green_selected,
    imageHeight: 50,
    imageWidth: 50,
    textColor: 'black',
    titleYOffset: 50,
    width: 50
  }
}
