import { roleTypes } from 'core/constants'
import { placeToNode } from 'utils/transformers'


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
