import { createLogger } from 'redux-logger'


export const loggerMiddleware = createLogger({
  collapsed: true,
  predicate: (getState, {type}) => {
    if (type && typeof type.startsWith === 'function') {
      if (type.startsWith('redux-tooltip')) {
        return false
      }
    }

    if ([
        'rrf/blur',
        'rrf/focus',
        'rrf/clearIntents',
        'rrf/setValidity'
      ].includes(type)) return false

    return true
  }
})
