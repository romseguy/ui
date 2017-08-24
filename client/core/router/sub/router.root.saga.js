import { call, put, select, take } from 'redux-saga/effects'

import { client } from 'core/apollo'
import { mainPanelActions } from 'core/mainPanel'
import { routerActions } from 'core/router'

import placeQuery from 'views/containers/place/place.query.graphql'
import userQuery from 'views/containers/user/user.query.graphql'

import { setCentreSaga, setDepartmentTitle, setTitleSaga } from './router.sub.saga'


export function* rootSaga(payload, settings) {
  const {centre} = settings
  yield call(setCentreSaga, centre)
  yield call(setDepartmentTitle)
}

export function* placesAddSaga(payload, settings) {
  const {centre} = settings
  yield call(setCentreSaga, centre)
}

export function* placeViewSaga(payload, settings) {
  const {name} = payload
  const {centre} = settings
  yield call(setCentreSaga, centre)
  yield put(mainPanelActions.setNodes([]))

  try {
    const {place: {city, department}} = yield call([client, client.readQuery], {
      query: placeQuery,
      variables: {title: name},
    })
    yield call(setTitleSaga, `${name} à ${city}, ${department}`)
  } catch (e) {
    let keepLooping = true

    while (keepLooping) {
      const {operationName, result} = yield take('APOLLO_QUERY_RESULT')

      if (operationName === 'place') {
        keepLooping = false

        if (!result.data || !result.data.place) {
          yield put(routerActions.notFoundRoute())
        } else {
          const {city, department} = result.data.place
          yield call(setTitleSaga, `${name} à ${city}, ${department}`)
        }
      }
    }
  }
}

export function* placeEditSaga(payload, settings) {
  const {centre} = settings
  yield call(setCentreSaga, centre)
}

export function* userViewSaga(payload, settings) {
  const {name: username, noReset} = payload
  const {centre} = settings
  yield call(setTitleSaga, username)
  yield call(setCentreSaga, centre)

  if (!noReset) {
    yield put(mainPanelActions.setNodes([]))
  }
}

export function* notFoundSaga() {
  yield call(setDepartmentTitle)
}
