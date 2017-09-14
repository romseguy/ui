import { call, put, take, select } from 'redux-saga/effects'

import { settingsActions, getCity, getDepartment } from 'core/settings'


export default function* setDepartmentTitleSaga() {
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
