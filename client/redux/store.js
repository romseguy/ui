import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { connectRoutes } from 'redux-first-router'
import createHistory from 'history/createBrowserHistory'

import { apolloMiddleware } from 'core/apollo'
import reducers from 'core/reducers'
import rootSaga from 'core/saga'
import routes from 'core/routes'

import { loggerMiddleware } from './logger.middleware'
import { sagaMiddleware } from './saga.middleware'


export function configureStore() {
  // Redux DevTools
  const rdtOptions = {
    actionsBlacklist: [
      'rrf/blur',
      'rrf/focus',
      'rrf/clearIntents',
      'rrf/setValidity'
    ],
    predicate: (state, {type}) => {
      if (typeof type.startsWith === 'function') {
        if (type.startsWith('redux-tooltip')) {
          return false
        }

        return true
      }
    }
  }
  const composeEnhancers = composeWithDevTools(rdtOptions)

  // router
  const history = createHistory()
  const {reducer, middleware, enhancer, initialDispatch} = connectRoutes(history, routes, {initialDispatch: false})

  // setup
  const middlewares = [
    middleware,
    sagaMiddleware,
    apolloMiddleware
  ];

  if (process.env.NODE_ENV === 'development' && window.log === true) {
    middlewares.push(loggerMiddleware)
  }

  const store = createStore(
    combineReducers({
      ...reducers,
      location: reducer,
    }),
    composeEnhancers(
      enhancer,
      applyMiddleware(...middlewares)
    ))

  sagaMiddleware.run(rootSaga)
  initialDispatch()

  return store
}
