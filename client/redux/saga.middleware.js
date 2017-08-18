import createSagaMiddleware from 'redux-saga'
import sagaMonitor from './sagaMonitor'


export const sagaMiddleware = createSagaMiddleware({sagaMonitor})
