import { call, getContext, put, select, take } from 'redux-saga/effects'

import { canvasActions } from 'core/canvas'
import { modalActions, modalConstants } from 'core/modal'
import { routerActions } from 'core/router'
import { i18n } from 'core/settings'

import logoutMutation from 'containers/auth/form/logout.mutation.graphql'
import placeQuery from 'dataContainers/place/place.query.graphql'
import userQuery from 'dataContainers/user/user.query.graphql'

import { setCentreSaga, setDepartmentTitle, setTitleSaga } from './router.sub.saga'


export function* rootSaga(payload, settings) {
  const {centre} = settings

  yield call(setCentreSaga, centre)
  yield call(setDepartmentTitle)
}

export function* aboutSaga(payload, settings) {
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

  yield call(setDepartmentTitle)
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

  yield call(setCentreSaga, centre)
  //yield call(setTitleSaga, `${i18n.t('header:place_profile')} ${placeName}`, {i18n: true})
  yield call(setTitleSaga, `${placeName}`, {i18n: true})

  /*
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
  */
}

export function* userViewSaga(payload, settings) {
  const {name: username, noReset} = payload
  const {centre} = settings

  yield call(setTitleSaga, `${i18n.t('header:user_profile')} ${username}`, {i18n: true})
  yield call(setCentreSaga, centre)
}

export function* notFoundSaga() {
  yield call(setDepartmentTitle)
}
