import { call, getContext } from 'redux-saga/effects'
import setErrorModalSaga from 'lib/sagas/setErrorModal.saga'


export default function* getBodySaga(payload, dataKey) {
  const {operationName, result} = payload
  const i18n = yield getContext('i18n')
  let body = {}

  if (result) {
    if (result.stack) {
      yield call(setErrorModalSaga, {
        title: i18n.t('errors:modal.unknown.title'),
        errors: [result /*i18n.t('errors:modal.unknown.content')*/]
      })

      // todo: send email
    }
    else if (result.data) {
      if (dataKey) {
        body = result.data[dataKey]
      } else {
        body = result.data[operationName]
      }
    }
    else if (result[operationName]) {
      body = result[operationName]
    }
  }

  return body
}

