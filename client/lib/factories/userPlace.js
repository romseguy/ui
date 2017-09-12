import roleTypes from 'lib/maps/roleTypes'
import { placeToNode } from 'lib/factories'


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

  return placeToNode(id, place, {mine, x, y})
}
