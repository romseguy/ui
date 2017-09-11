import React from 'react'

import { atoms as atomImages, entities } from 'assets/img'
import { Image } from 'components/layout'
import { entityTypes } from 'utils/types/entities'


const map = {
  [entityTypes.CITY]: entities.city,
  [entityTypes.DEPARTMENT]: atomImages.black,
  [entityTypes.PLACE]: entities.place,
  [entityTypes.PERSON]: entities.monad
}

function Entity({image, type, height = 50, width = 50}) {
  let src = image

  if (type) {
    src = map[type]
  }

  return (
    <Image src={src} height={height} width={width} spaced/>
  )
}

export default Entity
