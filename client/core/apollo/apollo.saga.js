import { all, call, getContext, put, select, take, takeEvery } from 'redux-saga/effects'

import { getResponseData } from 'lib/helpers/apollo'
import debug from 'lib/helpers/debug'
import { toggleErrorModalSaga } from 'core/shared/sagas'

import { settingsActions } from 'core/settings'


function* mutationErrorSaga({error}) {
  debug('mutationErrorSaga.error', JSON.parse(JSON.stringify(error)))
  const i18n = yield getContext('i18n')

  if (!error.message) {
    yield call(toggleErrorModalSaga, {
      modalComponentProps: {
        title: i18n.t('errors:modal.unknown.title'),
        errors: [i18n.t('errors:modal.unknown.content')]
      }
    })
  }
}

function* mutationResultSaga(payload) {
  const {operationName, result} = payload
  const i18n = yield getContext('i18n')

  if (['login', 'register'].includes(operationName)) {
    const data = yield call(getResponseData, payload)

    if (!data) {
      yield call(toggleErrorModalSaga, {
        modalComponentProps: {
          title: i18n.t('errors:modal.unknown.title'),
          errors: [result /*i18n.t('errors:modal.unknown.content')*/]
        }
      })
    }

    yield call([localStorage, localStorage.setItem], 'token', data[operationName].token)
  }
  else if (operationName === 'logout') {
    yield call([localStorage, localStorage.setItem], 'token', null)
  }
}

function* startupSaga() {
  const {result} = yield take('APOLLO_QUERY_RESULT')

  if (!result || result.message === 'Failed to fetch') {
    yield put({type: settingsActions.OFFLINE_MODE})
    yield call(toggleErrorModalSaga, {
      modalComponentProps: {
        title: 'System error',
        errors: ['Server is offline']
      }
    })
  }
}

export function* apolloSaga() {
  yield all([
    call(startupSaga),
    takeEvery('APOLLO_MUTATION_ERROR', mutationErrorSaga),
    takeEvery('APOLLO_MUTATION_RESULT', mutationResultSaga)
  ])
}
