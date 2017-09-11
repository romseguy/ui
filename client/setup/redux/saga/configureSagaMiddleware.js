import createSagaMiddleware from 'redux-saga'
import sagaMonitor from './sagaMonitor'


export default client => createSagaMiddleware({
  context: {
    client
  },
  sagaMonitor
})
