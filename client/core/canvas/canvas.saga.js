import { call, getContext, fork, put, take, takeEvery } from 'redux-saga/effects'

import { canvasActions } from 'core/canvas'


export function* canvasSaga() {
  const client = yield getContext('client')
}
