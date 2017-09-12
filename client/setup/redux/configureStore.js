import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { devToolsOptions } from './devTools'
import configureLoggerMiddleware from './logger'
import configureRouter from './router'
import configureSagaMiddleware from './saga'


export default function configureStore(reducer, routes, saga, client, i18n) {
  // devTools
  const composeEnhancers = composeWithDevTools(devToolsOptions)

  // router
  const router = configureRouter(routes)

  // middlewares
  const sagaMiddleware = configureSagaMiddleware(client, i18n)
  const middlewares = [
    router.middleware,
    sagaMiddleware,
    client.middleware()
  ];

  if (process.env.NODE_ENV === 'development') {
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
