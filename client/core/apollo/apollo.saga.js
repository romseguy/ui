import { all, call, getContext, put, select, take, takeEvery } from 'redux-saga/effects'

import { canvasActions } from 'core/canvas'
import { mapActions } from 'core/map'
import { settingsActions } from 'core/settings'

import { getResponseData } from 'helpers/apollo'
import setErrorModalSaga from 'lib/sagas/setErrorModal.saga'


function* startupSaga() {
  const {result} = yield take('APOLLO_QUERY_RESULT')

  if (!result || result.message === 'Failed to fetch') {
    yield put({type: settingsActions.OFFLINE_MODE})
    yield call(setErrorModalSaga, {
      title: 'System error',
      errors: ['Server is offline']
    })
  }
}

function* mutationResultSaga(payload) {
  const {operationName, result} = payload
  const i18n = yield getContext('i18n')

  if (['login', 'register'].includes(operationName)) {
    const data = yield call(getResponseData, payload)

    if (!data) {
      yield call(setErrorModalSaga, {
        title: i18n.t('errors:modal.unknown.title'),
        errors: [result /*i18n.t('errors:modal.unknown.content')*/]
      })
    }

    yield call([localStorage, localStorage.setItem], 'token', data[operationName].token)
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
    takeEvery('APOLLO_MUTATION_RESULT', mutationResultSaga),
    takeEvery('APOLLO_QUERY_INIT', queryInitSaga),
    takeEvery('APOLLO_QUERY_RESULT', queryResultSaga),
    takeEvery('APOLLO_QUERY_RESULT_CLIENT', queryResultClientSaga)
  ])
}
