import { all, call, put, select, take, takeEvery } from 'redux-saga/effects'

import { getBodySaga } from 'helpers/apollo'
import { setErrorModalSaga } from 'helpers/modal'

import { routerActions, getRouteType } from 'core/router'

import { mergePlaceIntoPersonNodesSaga, mergeUserPlacesIntoLocationNodesSaga } from './sagas'


function* startupSaga() {
  const {result = {}} = yield take('APOLLO_QUERY_RESULT')

  if (result.message === 'Failed to fetch') {
    yield call(setErrorModalSaga, {
      title: 'System error',
      errors: ['Server is offline']
    })
  }
}

function* mutationResultSaga(payload) {
  const {operationName, result} = payload

  if (['login', 'register'].includes(operationName)) {
    const body = yield call(getBodySaga, payload)
    yield call([localStorage, localStorage.setItem], 'token', body.token)
  }
  else if (operationName === 'logout') {
    const body = yield call(getBodySaga, payload)
    yield call([localStorage, localStorage.setItem], 'token', null)
  }
}

function* queryResultSaga(payload) {
  const {operationName} = payload

  if (operationName === 'me') {
    const myPlaces = yield call(getBodySaga, payload, 'myPlaces')
    const routeType = yield select(getRouteType)

    if ([routerActions.ME, routerActions.ME_PLACES_ADD, routerActions.ME_PLACE_EDIT].includes(routeType)) {
      yield call(mergeUserPlacesIntoLocationNodesSaga, myPlaces)
    }
  }
  else if (operationName === 'place') {
    const place = yield call(getBodySaga, payload)
    const routeType = yield select(getRouteType)

    if (routeType === routerActions.PLACE_VIEW) {
      yield call(mergePlaceIntoPersonNodesSaga, place)
    }
  }
  else if (operationName === 'user') {
    const myPlaces = yield call(getBodySaga, payload, 'myPlaces')
    const routeType = yield select(getRouteType)

    if (routeType === routerActions.USER_VIEW) {
      yield call(mergeUserPlacesIntoLocationNodesSaga, myPlaces)
    }
  }
}

function* queryResultClientSaga(payload) {
  const {operationName} = payload

  if (operationName === 'me') {
    const myPlaces = yield call(getBodySaga, payload, 'myPlaces')
    const routeType = yield select(getRouteType)

    if ([routerActions.ME, routerActions.ME_PLACES_ADD, routerActions.ME_PLACE_EDIT].includes(routeType)) {
      yield call(mergeUserPlacesIntoLocationNodesSaga, myPlaces)
    }
  }
  else if (operationName === 'place') {
    const place = yield call(getBodySaga, payload)
    const routeType = yield select(getRouteType)

    if (routeType === routerActions.PLACE_VIEW) {
      yield call(mergePlaceIntoPersonNodesSaga, place)
    }
  }
  else if (operationName === 'user') {
    const myPlaces = yield call(getBodySaga, payload, 'myPlaces')
    const routeType = yield select(getRouteType)

    if (routeType === routerActions.USER_VIEW) {
      yield call(mergeUserPlacesIntoLocationNodesSaga, myPlaces)
    }
  }
}

export function* apolloSaga() {
  yield all([

    //====================================
    //  STARTUP
    //------------------------------------

    call(startupSaga),

    //====================================
    //  ACTIONS -> TASKS
    //------------------------------------

    //takeEvery('APOLLO_MUTATION_ERROR', mutationErrorSaga),
    takeEvery('APOLLO_MUTATION_RESULT', mutationResultSaga),
    takeEvery('APOLLO_QUERY_RESULT', queryResultSaga),
    takeEvery('APOLLO_QUERY_RESULT_CLIENT', queryResultClientSaga)
  ])
}
