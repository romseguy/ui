import { call, put, select, take } from 'redux-saga/effects'

import { client } from 'core/apollo'
import { canvasActions } from 'core/canvas'
import { routerActions } from 'core/router'
import { i18n } from 'core/settings'

import placeQuery from 'views/containers/place/place.query.graphql'
import userQuery from 'views/containers/user/user.query.graphql'

import { setCentreSaga, setDepartmentTitle, setTitleSaga } from './router.sub.saga'


export function* rootSaga(payload, settings) {
  const {centre} = settings
  yield call(setCentreSaga, centre)
  yield call(setDepartmentTitle)
}

export function* placeEditSaga(payload, settings) {
  const {centre} = settings
  yield call(setCentreSaga, centre)
}

export function* placesAddSaga(payload, settings) {
  const {centre} = settings
  yield call(setCentreSaga, centre)
}

export function* placeViewSaga(payload, settings) {
  const {name: placeName, noReset} = payload
  const {centre} = settings

  yield call(setCentreSaga, centre)

  if (!noReset) {
    yield put(canvasActions.setNodes([]))
  }

  try {
    const {
      myPlaces,
      place: {city, department}
    } = yield call([client, client.readQuery], {
      query: placeQuery,
      variables: {title: placeName},
    })

    const myPlace = myPlaces.find(({place}) => place.title === placeName)

    yield call(setTitleSaga, `${i18n.t(`header:role.${myPlace.role.id}`)} "${placeName}" à ${city}, ${department}`)
  } catch (e) {
    let keepLooping = true

    while (keepLooping) {
      const {operationName, result} = yield take('APOLLO_QUERY_RESULT')

      if (operationName === 'place') {
        keepLooping = false

        if (!result.data || !result.data.place) {
          yield put(routerActions.notFoundRoute())
          return
        }

        const {
          data: {
            myPlaces,
            place: {city, department}
          }
        } = result

        const myPlace = myPlaces.find(({place}) => place.title === placeName)

        yield call(setTitleSaga, `${i18n.t(`header:role.${myPlace.role.id}`)} "${placeName}" à ${city}, ${department}`)
      }
    }
  }
}

export function* userViewSaga(payload, settings) {
  const {name: username, noReset} = payload
  const {centre} = settings
  yield call(setTitleSaga, username)
  yield call(setCentreSaga, centre)

  if (!noReset) {
    yield put(canvasActions.setNodes([]))
  }
}

export function* notFoundSaga() {
  yield call(setDepartmentTitle)
}
