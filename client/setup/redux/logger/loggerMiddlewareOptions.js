import { canvasActions } from 'core/canvas'


export default {
  collapsed: true,

  predicate: (getState, {type}) => {
    return false
    if (type && typeof type.startsWith === 'function') {
      if (type.startsWith('@@redux-form')) {
        return false
      }
      if (type.startsWith('redux-tooltip')) {
        return false
      }
    }

    return type !== canvasActions.SET_CANVAS_NODES
  }
}
