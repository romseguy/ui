import { all, call, fork } from 'redux-saga/effects'

import makeRestartable from 'lib/helpers/makeRestartable'

import sagas from 'core/core.sagas'
import initializeUserLocationSaga from 'core/settings/sagas/initializeUserLocation.saga'


export default function* setupSaga() {
  yield fork(initializeUserLocationSaga)

  // DO NOT EDIT BELOW THIS LINE
  yield all(sagas.map(saga => call(makeRestartable(saga))))
}
