import i18next from 'i18next'
import XHR from 'i18next-xhr-backend'
// import Cache from 'i18next-localstorage-cache'
import LanguageDetector from 'i18next-browser-languagedetector'
import { delay } from 'redux-saga'
import { call, put, take, takeEvery, select, race } from 'redux-saga/effects'

import { CustomError } from 'utils/errors'
import { setErrorModalSaga } from 'utils/modal'

import { getCurrentPosition, getCurrentPositionErrorCodes } from 'views/utils/navigator'

import { settingsActions } from './settings.actions'
import { getLocationDataSaga } from './shared'


export let i18n = i18next
  .use(XHR)
  // .use(Cache)
  .use(LanguageDetector)

const i18nOptions = {
  fallbackLng: 'en',

  whitelist: ['en', 'fr'],

  react: {
    wait: true, // globally set to wait for loaded translations in translate hoc
    // exposeNamespace: true // exposes namespace on data-i18next-options to be used in eg. locize-editor
  },

  // have a common namespace used around the full app
  ns: ['common', 'errors', 'form', 'accounts', 'canvas', 'header'],
  defaultNS: 'common',

  backend: {
    loadPath: `${process.env.REACT_APP_LOCALES_URL}/{{lng}}/{{ns}}.json`,
    crossDomain: true
  },

  debug: window.log && process.env.NODE_ENV === 'development',

  // cache: {
  //   enabled: true
  // },

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
    format: function(value, format, lng) {
      if (format === 'uppercase') return value.toUpperCase()
      return value
    }
  }
}

function i18nInit() {
  return new Promise((resolve, reject) => {
    i18n = i18n.init(i18nOptions, () => {
      resolve()
    })
  })
}

export function* settingsSaga() {
  yield call(i18nInit)
  yield put(settingsActions.i18nInitialized())

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
    if (error.name === 't1') {
      // todo: open modal for custom city selection
      yield put(settingsActions.setLocation(44.2167, 4.2667))
      yield put(settingsActions.setDepartment('Gard'))
      yield put(settingsActions.setCity('Uzès'))
    }
    else if (error.name === 't2') {
      // todo: open modal for custom city selection
      yield put(settingsActions.setDepartment('Gard'))
      yield put(settingsActions.setCity('Uzès'))
    }
    else if (error.code === getCurrentPositionErrorCodes.USER_DENIED_GEOLOCATION) {
      // todo: open modal for custom city selection
      console.info('todo: open modal for custom location selection')
    }
    else if (error.code === getCurrentPositionErrorCodes.USER_IS_OFFLINE) {
      if (process.env.NODE_ENV !== 'development') {
        yield call(setErrorModalSaga, {
          title: i18n.t('errors:modal.offline.title'),
          errors: [i18n.t('errors:modal.offline.content')]
        })
      }
      yield put(settingsActions.setLocation(44.2167, 4.2667))
      yield put(settingsActions.setDepartment('Gard'))
      yield put(settingsActions.setCity('Uzès'))
    }
    else {
      console.error(error)
    }
  }
}
