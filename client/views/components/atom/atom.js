import React from 'react'

import { atoms as atomImages } from 'views/assets/img'
import { Image } from 'views/components/layout'
import { atomTypes } from 'views/utils/atoms'


const map = {
  [atomTypes.DEPARTMENT]: atomImages.black,
  [atomTypes.LOCATION]: atomImages.green,
  [atomTypes.PERSON]: atomImages.yellow
}

function Atom({image, type, height, width}) {
  let src = image

  if (type) {
    src = map[type]
  }

  return (
    <Image src={src} height={height} width={width} spaced/>
  )
}

export default Atom
