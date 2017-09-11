import { bindActionCreators as bac } from 'redux'
import { filter, is } from 'ramda'


export function bindActionCreators(actions, dispatch) {
  if (typeof actions === 'function') {
    return bac(actions, dispatch)
  }
  return bac(filter(is(Function), actions), dispatch)
}
