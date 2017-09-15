import { all, call, put, select, take, takeEvery } from 'redux-saga/effects'

import { canvasActions } from 'core/canvas'
import { mapActions } from 'core/map'
import { routerActions, getRouteType } from 'core/router'

import getBodySaga from 'lib/sagas/getBody.saga'
import setErrorModalSaga from 'lib/sagas/setErrorModal.saga'


function* startupSaga() {
  const {result} = yield take('APOLLO_QUERY_RESULT')

  if (!result || result.message === 'Failed to fetch') {
    yield put({type: 'OFFLINE_MODE'})
    window.offlineMode = true // todo: remove
    yield call(setErrorModalSaga, {
      title: 'System error',
      errors: ['Server is offline']
    })
  }
}

function* mutationResultSaga(payload) {
  const {operationName, result} = payload

  if (['login', 'register'].includes(operationName)) {
    const body = yield call(getBodySaga, payload)
    yield call([localStorage, localStorage.setItem], 'token', body.token)
  }
  else if (operationName === 'logout') {
    yield call([localStorage, localStorage.setItem], 'token', null)
  }
}

function* queryInitSaga(payload) {
  const {operationName} = payload

  if (operationName === 'places') {
    yield put(mapActions.setNodesLoading(true))
  }
  else if (operationName === 'myPlaces') {
    yield put(canvasActions.setNodesLoading(true))
  }
}

function* queryResultSaga(payload) {
  const {operationName} = payload

  if (operationName === 'myPlaces') {
    yield put(canvasActions.setNodesLoading(false))
  }
  else if (operationName === 'places') {
    yield put(mapActions.setNodesLoading(false))
  }
}

function* queryResultClientSaga(payload) {
  const {operationName} = payload

  if (operationName === 'myPlaces') {
    yield put(canvasActions.setNodesLoading(false))
  }
  else if (operationName === 'places') {
    yield put(mapActions.setNodesLoading(false))
  }
}

export function* apolloSaga() {
  yield all([
    call(startupSaga),
    //takeEvery('APOLLO_MUTATION_ERROR', mutationErrorSaga),
    takeEvery('APOLLO_MUTATION_RESULT', mutationResultSaga),
    takeEvery('APOLLO_QUERY_INIT', queryInitSaga),
    takeEvery('APOLLO_QUERY_RESULT', queryResultSaga),
    takeEvery('APOLLO_QUERY_RESULT_CLIENT', queryResultClientSaga)
  ])
}
