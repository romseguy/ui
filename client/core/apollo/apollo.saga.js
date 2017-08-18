import { all, call, put, take, takeEvery } from 'redux-saga/effects'

import { i18n, settingsActions } from 'core/settings'
import { setErrorModalSaga } from 'utils/modal'

import { authActions } from 'core/auth'


function* startupSaga() {
  let keepLooping = true

  while (keepLooping) {
    const {operationName, result = {}} = yield take('APOLLO_QUERY_RESULT')

    switch (operationName) {
      case 'currentUser':
        keepLooping = false

        if (result.message === 'Failed to fetch') {
          yield call(setErrorModalSaga, {
            title: 'System error',
            errors: ['Server is offline']
          })
        }

        if (!result.data || !result.data.currentUser) {
          yield put(authActions.setIsAuthed(false))
          return
        }

        yield put(authActions.setIsAuthed(true))
        break
    }
  }
}

function* mutationResultSaga({operationName, result}) {
  let body = {}

  if (result) {
    if (result.stack) {
      yield call(setErrorModalSaga, {title: i18n.t('errors:modal.unknown.title'), errors: [result /*i18n.t('errors:modal.unknown.content')*/]}) // todo send email
      return
    }
    else if (result.data) {
      body = result.data[operationName]
    }
    else if (result[operationName]) {
      body = result[operationName]
    }
  }

  switch (operationName) {
    case 'login':
      yield call([localStorage, localStorage.setItem], 'token', body.token)
      break

    case 'logout':
      yield call([localStorage, localStorage.setItem], 'token', null)
      break
  }
}

export function* apolloSaga() {
  yield all([

    //====================================
    //  STARTUP
    //------------------------------------

    call(startupSaga),

    //====================================
    //  ACTIONS -> TASKS
    //------------------------------------

    //takeEvery('APOLLO_MUTATION_ERROR', mutationErrorSaga),
    takeEvery('APOLLO_MUTATION_RESULT', mutationResultSaga)
  ])
}
