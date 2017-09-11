import { call, put, take, select } from 'redux-saga/effects'

import { meActions } from 'core/me'


export default function* setCentreSaga(c, params) {
  yield put(meActions.setCentre(c, params))
}
