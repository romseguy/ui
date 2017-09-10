import React from 'react'

import { atoms as atomImages, entities } from 'views/assets/img'
import { Image } from 'views/components/layout'
import { atomTypes } from 'views/utils/atoms'


const map = {
  [atomTypes.DEPARTMENT]: atomImages.black,
  [atomTypes.LOCATION]: entities.place,
  [atomTypes.PERSON]: entities.monad
}

function Atom({image, type, height = 50, width = 50}) {
  let src = image

  if (type) {
    src = map[type]
  }

  return (
    <Image src={src} height={height} width={width} spaced/>
  )
}

export default Atom
