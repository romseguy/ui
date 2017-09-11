import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { devToolsOptions } from './devTools'
import configureLoggerMiddleware from './logger'
import configureRouter from './router'
import configureSagaMiddleware from './saga'


function configureStore(reducer, routes, saga, client) {
  // devTools
  const composeEnhancers = composeWithDevTools(devToolsOptions)

  // router
  const router = configureRouter(routes)

  // middlewares
  const sagaMiddleware = configureSagaMiddleware(client)
  const middlewares = [
    router.middleware,
    sagaMiddleware,
    client.middleware()
  ];

  if (process.env.NODE_ENV === 'development' && window.log === true) {
    middlewares.push(configureLoggerMiddleware())
  }

  // reducers
  const reducers = {
    ...reducer,
    apollo: client.reducer(),
    location: router.reducer,
  }

  const store = createStore(
    combineReducers(reducers),
    composeEnhancers(
      router.enhancer,
      applyMiddleware(...middlewares)
    )
  )

  sagaMiddleware.run(saga)
  router.initialDispatch()

  return store
}

export default configureStore
