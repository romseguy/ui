import { delay } from 'redux-saga'
import { call, spawn, all } from 'redux-saga/effects'

import debug from 'helpers/debug'

import { apolloSaga } from './apollo'
import { canvasSaga } from './canvas'
import { mapSaga } from './map'
import { meSaga } from './me'
import { modalSaga } from './modal'
import { routerSaga } from './router'
import { settingsSaga } from './settings'

const makeRestartable = saga => {
  return function* restartableSaga() {
    yield spawn(function* run() {
        try {
          yield call(saga)

          if (!['settingsSaga'].includes(saga.name)) {
            debug(`unexpected ${saga.name} termination`, saga)
          }
        } catch (e) {
          debug(`${saga.name} error, the saga will be restarted`, e)
          yield call(saga)
        }
        yield delay(1000) // Avoid infinite failures blocking app TODO use backoff retry policy...
    })
  }
}

const rootSagas = [
  apolloSaga,
  canvasSaga,
  mapSaga,
  meSaga,
  //modalSaga,
  routerSaga,
  settingsSaga,
].map(makeRestartable)

export default function* root() {
  yield all(rootSagas.map(saga => call(saga)))
}
