import { call, put, take, select } from 'redux-saga/effects'

import { settingsActions, getI18nInitialized } from 'core/settings'


export default function* setTitleSaga(title, {i18n} = {}) {
  if (i18n) {
    const initialized = yield select(getI18nInitialized)

    if (!initialized) {
      yield take(settingsActions.I18N_INITIALIZED)
    }
  }

  yield put(settingsActions.setTitle(
    typeof title === 'function' ? title() : title
  ))
}


