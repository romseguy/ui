import { delay } from 'redux-saga'
import { call, spawn, put, select, all } from 'redux-saga/effects'

import { apolloSaga } from './apollo'
import { authSaga } from './auth'
import { meSaga } from './me'
import { modalSaga } from './modal'
import { placesSaga } from './places'
import { routerSaga } from './router'
import { settingsSaga } from './settings'

const makeRestartable = saga => {
  return function* restartableSaga() {
    yield spawn(function* run() {
        try {
          yield call(saga)

          if (!['authSaga', 'settingsSaga', 'placesSaga'].includes(saga.name)) {
            console.error(`unexpected ${saga.name} termination`, saga)
          }
        } catch (e) {
          console.error(`${saga.name} error, the saga will be restarted`, e)
          yield call(saga)
        }
        yield delay(1000) // Avoid infinite failures blocking app TODO use backoff retry policy...
    })
  }
}

const rootSagas = [
  apolloSaga,
  authSaga,
  meSaga,
  modalSaga,
  placesSaga,
  routerSaga,
  settingsSaga,
].map(makeRestartable)

export default function* root() {
  yield all(rootSagas.map(saga => call(saga)))
}