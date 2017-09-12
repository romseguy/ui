import { css } from 'styled-components'
import sizeTypes from 'lib/maps/sizeTypes'


// media will be a map associating sizes labels with styled-components templates
const media = Object.keys(sizeTypes).reduce((accumulator, label) => {
  // use em in breakpoints to work properly cross-browser and support users
  // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
  const emSize = sizeTypes[label] / 16

  accumulator[label] = (...args) => {
    if (label === 'desktop') {
      return css`
        ${css(...args)}
      `
    }

    return css`
      @media only screen and (max-width: ${emSize}em) {
        ${css(...args)}
      }
    `
  }

  return accumulator
}, {})

export default media