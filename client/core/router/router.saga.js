import { isLocationAction, NOT_FOUND } from 'redux-first-router'
import { all, call, fork, put, select, spawn, take, takeEvery } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import routes from 'core/routes'
import { modalActions, modalConstants } from 'core/modal'

import { routerActions } from './router.actions'
import routeSagas from './sub'
import { isAuthedSaga } from './sub/router.sub.saga'


function* locationChangedSaga({type: routeType, payload, meta}) {
  const currentRoute = routes[routeType]

  if (routeType === NOT_FOUND) {
    yield put(routerActions.notFoundRoute())
    return
  }

  const isAuthed = yield call(isAuthedSaga)

  if (currentRoute.requiresAuth) {
    if (!isAuthed) {
      yield put(routerActions.authRoute())
      yield put(modalActions.setModal(modalConstants.AUTH, {isOpen: true}))
      return
    }
  }

  if (routeSagas[routeType]) {
    const settings = {isAuthed, centre: currentRoute.centre}
    yield spawn(routeSagas[routeType], payload, settings)
  }
}

export function* routerSaga() {

  //====================================
  //  ROUTER EVENTS -> TASKS
  //------------------------------------

  while (true) {
    const action = yield take('*')

    if (isLocationAction(action)) {
      yield delay(100) // can be removed when duplicate redux-first-router actions are fixed
      yield fork(locationChangedSaga, action)
    }
  }
}
