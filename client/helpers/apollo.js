import { i18n } from 'core/settings'
import { setErrorModalSaga } from 'helpers/modal'

export function* getBodySaga(payload, dataKey) {
  const {operationName, result} = payload
  let body = {}

  if (result) {
    if (result.stack) {
      yield call(setErrorModalSaga, {title: i18n.t('errors:modal.unknown.title'), errors: [result /*i18n.t('errors:modal.unknown.content')*/]}) // todo: send email
    }
    else if (result.data) {
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

