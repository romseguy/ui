import React from 'react'

import { atoms as atomImages } from 'assets/img'
import { Image } from 'components/layout'
import { symbolTypes } from 'utils/types/symbols'


const map = {
  [symbolTypes.SERVICE]: atomImages.red
}

function Symbol({image, type, height = 50, width = 50}) {
  let src = image

  if (type) {
    src = map[type]
  }

  return (
    <Image src={src} height={height} width={width} spaced/>
  )
}

export default Symbol

