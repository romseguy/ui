import React from 'react'

import { atoms as atomImages } from 'views/assets/img'
import { Image } from 'views/components/layout'
import { symbolTypes } from 'views/utils/symbols'


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

