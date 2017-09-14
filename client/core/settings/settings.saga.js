import { delay } from 'redux-saga'
import { call, getContext, put, take, takeEvery, select, race } from 'redux-saga/effects'

import getCurrentPosition from 'helpers/getCurrentPosition'
import CustomError from 'lib/classes/customError'
import getCurrentPositionErrorCodes from 'lib/maps/getCurrentPositionErrorCodes'

import setErrorModalSaga from 'lib/sagas/setErrorModal.saga'
import getLocationDataSaga from 'lib/sagas/getLocationData.saga'

import { settingsActions } from './settings.actions'


export function* settingsSaga() {
  const i18n = yield getContext('i18n')

  try {
    const {currentPosition, t1} = yield race({
      currentPosition: call(getCurrentPosition),
      t1: delay(10000)
    })

    if (t1) {
      throw new CustomError({
        name: 't1',
        message: 'browser geolocation timed out'
      })
    }

    const {coords: {latitude: lat, longitude: lng}} = currentPosition
    yield put(settingsActions.setLocation(lat, lng))

    const {locationData, t2} = yield race({
      locationData: call(getLocationDataSaga, lat, lng),
      t2: delay(10000)
    })

    if (t2) {
      throw new CustomError({
        name: 't2',
        message: 'location data resolution timed out'
      })
    }

    if (locationData) {
      const {department, city} = locationData

      yield put(settingsActions.setDepartment(department))
      yield put(settingsActions.setCity(city))
    }
  } catch (error) {
    if (error.name === 't1' || error.code === getCurrentPositionErrorCodes.USER_DENIED_GEOLOCATION) {
      yield put(settingsActions.setLocation(48.8566, 2.3522))
      yield put(settingsActions.setDepartment(false))
      yield put(settingsActions.setCity(false))
    }
    else if (error.name === 't2') {
      yield put(settingsActions.setDepartment(false))
      yield put(settingsActions.setCity(false))
    }
    else if (error.code === getCurrentPositionErrorCodes.USER_IS_OFFLINE) {
      if (process.env.NODE_ENV !== 'development') {
        yield call(setErrorModalSaga, {
          title: i18n.t('errors:modal.offline.title'),
          errors: [i18n.t('errors:modal.offline.content')]
        })
      }

      yield put(settingsActions.setLocation(48.8566, 2.3522))
      yield put(settingsActions.setDepartment(false))
      yield put(settingsActions.setCity(false))
    }
    else {
      console.error(error)
    }
  }
}
