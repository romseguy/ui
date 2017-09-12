import { call, getContext, put, select, take } from 'redux-saga/effects'

import { modalActions, modalConstants } from 'core/modal'
import { routerActions } from 'core/router'

import setCentreSaga from 'sagas/setCentre.saga'
import setDepartmentTitleSaga from 'sagas/setDepartmentTitle.saga'
import setTitleSaga from 'sagas/setTitle.saga'

import logoutMutation from 'graphql/mutations/logout.mutation.graphql'


export function* rootSaga(payload, settings) {
  const {centre} = settings

  yield call(setCentreSaga, centre)
  yield call(setDepartmentTitleSaga)
}

export function* aboutSaga(payload, settings) {
  const i18n = yield getContext('i18n')
  yield call(setTitleSaga, i18n.t('about'), {i18n: true})
}

export function* authSaga(payload, settings) {
  const {currentUser} = settings

  if (currentUser) {
    yield put(routerActions.rootRoute())
  } else {
    yield put(modalActions.setModal(modalConstants.AUTH, {
      isOpen: true,
      modalProps: {
        size: 'small',
        basic: true,
        closeOnRootNodeClick: false
      }
    }))
  }

  yield call(setDepartmentTitleSaga)
}

export function* logoutSaga(payload, settings) {
  const {currentUser} = settings
  const client = yield getContext('client')

  if (currentUser) {
    yield call([client, client.mutate], {
      mutation: logoutMutation
    })
  }

  yield put(routerActions.rootRoute())
}

// NIY
export function* placeEditSaga(payload, settings) {
  const {centre} = settings

  yield call(setCentreSaga, centre)
}

// NIY
export function* placesAddSaga(payload, settings) {
  const {centre} = settings

  yield call(setCentreSaga, centre)
}

export function* placeViewSaga(payload, settings) {
  const {name: placeName} = payload
  const {centre} = settings
  const i18n = yield getContext('i18n')

  yield call(setCentreSaga, centre)
  yield call(setTitleSaga, `${placeName}`)
}

export function* userViewSaga(payload, settings) {
  const {name: username, noReset} = payload
  const {centre} = settings
  const i18n = yield getContext('i18n')

  yield call(setTitleSaga, `${username}`)
  yield call(setCentreSaga, centre)
}

export function* notFoundSaga() {
  yield call(setDepartmentTitleSaga)
}
