import { call, getContext, put, take, select } from 'redux-saga/effects'

import { meActions } from 'core/me'
import { settingsActions, getCity, getDepartment, getI18nInitialized } from 'core/settings'

import currentUserQuery from 'dataContainers/app/currentUser.query.graphql'


export function* getCurrentUserSaga() {
  try {
    const client = yield getContext('client')

    const result = yield call([client, client.readQuery], {
      query: currentUserQuery
    })

    return result ? result.currentUser : null
  } catch (e) {
    while (true) {
      const {operationName, result} = yield take(['APOLLO_QUERY_RESULT', 'APOLLO_QUERY_RESULT_CLIENT'])
      if (['currentUser'].includes(operationName)) {
        return result.data ? result.data.currentUser : null
      }
    }
  }
}

export function* setCentreSaga(c, params) {
  yield put(meActions.setCentre(c, params))
}

export function* setTitleSaga(title, {i18n} = {}) {
  if (i18n) {
    const initialized = yield select(getI18nInitialized)

    if (!initialized) {
      yield take(settingsActions.I18N_INITIALIZED)
    }
  }

  yield put(settingsActions.setTitle(title))
}

export function* setDepartmentTitle() {
  let city = yield select(getCity)
  let department = yield select(getDepartment)

  while (!city || !department) {
    const action = yield take([settingsActions.SET_CITY, settingsActions.SET_DEPARTMENT])

    switch (action.type) {
      case settingsActions.SET_CITY:
        city = action.payload.city
        break
      case settingsActions.SET_DEPARTMENT:
        department = action.payload.department
        break
    }
  }

  //yield put(settingsActions.setTitle(`${city}, ${department}`))
  yield put(settingsActions.setTitle(`${city}`))
}

