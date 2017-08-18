import { put, take, select } from 'redux-saga/effects'

import { authActions, getIsAuthed } from 'core/auth'
import { meActions } from 'core/me'
import { settingsActions, getCity, getDepartment } from 'core/settings'


export function* isAuthedSaga() {
  let isAuthed = yield select(getIsAuthed)

  if (isAuthed === null) {
    const {payload} = yield take(authActions.SET_IS_AUTHED)
    isAuthed = payload.isAuthed
  }

  return isAuthed
}

export function* setCentreSaga(c, params) {
  yield put(meActions.setCentre(c, params))
}

export function* setTitleSaga(title) {
  yield put(settingsActions.setTitle(title))
}

export function* setDepartmentTitle() {
  let city = yield select(getCity)
  let department = yield select(getDepartment)

  if (!city && !department) {
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
  }

  yield put(settingsActions.setTitle(`${city}, ${department}`))
}

