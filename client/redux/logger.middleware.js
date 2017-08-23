import { createLogger } from 'redux-logger'
import { mainPanelActions } from 'core/mainPanel'

export const loggerMiddleware = createLogger({
  collapsed: true,
  predicate: (getState, {type}) => {
    if (type && typeof type.startsWith === 'function') {
      if (type.startsWith('redux-tooltip')) {
        return false
      }
    }

    return type !== mainPanelActions.SET_MAIN_PANEL_NODES
  }
})
