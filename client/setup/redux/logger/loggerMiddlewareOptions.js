import { canvasActions } from 'core/canvas'


export default {
  collapsed: true,

  predicate: (getState, {type}) => {
    if (type && typeof type.startsWith === 'function') {
      if (type.startsWith('@@redux-form')) {
        return true
      }
/*      if (type.startsWith('redux-tooltip')) {
        return false
      }*/
    }

    //return type !== canvasActions.SET_NODES
    return false

  }
}
