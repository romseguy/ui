import { createLogger } from 'redux-logger'
import { canvasActions } from 'core/canvas'

export const loggerMiddleware = createLogger({
  collapsed: true,
  predicate: (getState, {type}) => {
    if (type && typeof type.startsWith === 'function') {
      if (type.startsWith('redux-tooltip')) {
        return false
      }
    }

    return type !== canvasActions.SET_NODES
  }
})
