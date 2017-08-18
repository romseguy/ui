// these sizes are arbitrary and you can set them to whatever you wish
import { css } from 'styled-components'

const sizes = {
  desktop: 992,
  tablet: 767,
  phone: 376
}

// iterate through the sizes and create a media template
export const media = Object.keys(sizes).reduce((accumulator, label) => {
  // use em in breakpoints to work properly cross-browser and support users
  // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
  const emSize = sizes[label] / 16

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
