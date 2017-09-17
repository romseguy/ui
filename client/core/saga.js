import { call, all } from 'redux-saga/effects'

import makeRestartable from 'helpers/makeRestartable'

import { apolloSaga } from './apollo'
import { canvasSaga } from './canvas'
import { meSaga } from './me'
import { modalSaga } from './modal'
import { routerSaga } from './router'
import { settingsSaga } from './settings'

const rootSagas = [
  apolloSaga,
  canvasSaga,
  meSaga,
  //modalSaga,
  routerSaga,
  settingsSaga,
].map(makeRestartable)

export default function* root() {
  yield all(rootSagas.map(saga => call(saga)))
}
