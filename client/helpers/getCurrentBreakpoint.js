import breakpoints from 'lib/maps/breakpoints'
import sizeTypes from 'lib/maps/sizeTypes'


export default function getCurrentBreakpoint(width) {
  if (width <= breakpoints[sizeTypes.MOBILE]) {
    return sizeTypes.MOBILE
  }

  if (width <= breakpoints[sizeTypes.TABLET]) {
    return sizeTypes.TABLET
  }

  if (width <= breakpoints[sizeTypes.COMPUTER]) {
    return sizeTypes.COMPUTER
  }

  return sizeTypes.WIDE
}
