import { isLocationAction, NOT_FOUND } from 'redux-first-router'
import { call, fork, getContext, put, select, spawn, take } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import { getPrevRouteType } from 'core/router'
import routes from 'core/routes'
import { getOfflineMode } from 'core/settings'

import getCurrentUserSaga from 'lib/sagas/getCurrentUser.saga'

import { routerActions } from './router.actions'


function* locationChangedSaga({type: routeType, payload, meta}) {
  const currentRoute = routes[routeType]

  if (routeType === NOT_FOUND) {
    yield put(routerActions.notFoundRoute())
    return
  }

  const offlineMode = yield select(getOfflineMode)

  if (offlineMode) {
    return
  }

  const currentUser = yield call(getCurrentUserSaga)

  if (currentRoute.requiresAuth) {
    if (!currentUser) {
      yield put(routerActions.authRoute())
      return
    }
  }

  if (currentRoute.saga) {
    const prevRouteType = yield select(getPrevRouteType)
    const settings = {
      client: yield getContext('client'),
      i18n: yield getContext('i18n'),
      currentUser,
      onEnter: prevRouteType === '',
      prevRoute: {...routes[prevRouteType], type: prevRouteType}
    }
    yield spawn(currentRoute.saga, payload, settings)
  }
}

export function* routerSaga() {
  while (true) {
    const action = yield take(isLocationAction)

    // when a route param contains special characters or spaces
    // it's escaped by the browser (e.g spaces into %20) and the route saga is spawned twice
    // so we use a delay
    yield delay(100)

    yield fork(locationChangedSaga, action)
  }
}
