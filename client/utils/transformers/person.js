import { entityTypes } from 'utils/types/entities'
import { entities } from 'assets/img'


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
    type: entityTypes.PERSON,

    // state
    name: username,
    x: x ? parseFloat(x) : (id + 1) * 100,
    y: y ? parseFloat(y) : (id + 1) * 100,

    // options
    titleYOffset: 50,
    height: 100,
    width: 50,

    // images
    image: entities.monad,
    imageSelected: entities.monad_selected,
    imageHeight: 50,
    imageWidth: 50
  }
}
