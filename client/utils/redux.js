import { bindActionCreators as bac } from 'redux'
import { filter, is } from 'ramda'


export function bindActionCreators(map, dispatch) {
  return bac(filter(is(Function), map), dispatch)
}
