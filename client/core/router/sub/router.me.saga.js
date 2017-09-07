import { call, put, select, take } from 'redux-saga/effects'

import { client } from 'core/apollo'
import { canvasActions, getCanvasNodesSaga } from 'core/canvas'
import { routerActions } from 'core/router'
import { i18n } from 'core/settings'

import placeQuery from 'views/dataContainers/place/place.query.graphql'
import currentUserQuery from 'views/dataContainers/app/currentUser.query.graphql'

import { setCentreSaga, setTitleSaga } from './router.sub.saga'


export function* meSaga(payload, settings) {
  const {centre} = settings

  yield call(setCentreSaga, centre)

  /*
   const {currentUser: {username}} = yield call([client, client.readQuery], {
   query: currentUserQuery
   })

   yield call(setTitleSaga, username)
   */
}

export function* mePlaceEditSaga(payload, settings) {
  const {centre} = settings
  const {name: placeName} = payload

  yield call(setCentreSaga, centre)

  const nodes = yield call(getCanvasNodesSaga)
  const selectedNode = nodes.find(node => node.name === placeName)

  // todo: 404 place
  yield call(setTitleSaga, `${i18n.t('header:place_profile')} ${placeName}`, {i18n: true})

  if (selectedNode) {
    yield put(canvasActions.selectNode(true, selectedNode))
  }

  /*
   try {
   const {place: {city, department}} = yield call([client, client.readQuery], {
   query: placeQuery,
   variables: {title: placeName},
   })

   yield call(setTitleSaga, `${placeName} à ${city}, ${department}`)
   } catch (e) {
   let keepLooping = true

   while (keepLooping) {
   const {operationName, result} = yield take(['APOLLO_QUERY_RESULT', 'APOLLO_QUERY_RESULT_CLIENT'])

   if (['placeForm', 'place'].includes(operationName)) {
   keepLooping = false

   if (!result.data || !result.data.place) {
   yield put(routerActions.meRoute())
   } else {
   const {city, department} = result.data.place
   yield call(setTitleSaga, `${placeName} à ${city}, ${department}`)
   }
   }
   }
   }*/
}

export function* mePlacesAddSaga(payload, settings) {
  const {centre} = settings

  yield call(setCentreSaga, centre)

  /*
   const {currentUser: {username}} = yield call([client, client.readQuery], {
   query: currentUserQuery
   })

   yield call(setTitleSaga, username)
   */
}

// NIY
export function* mePlaceViewSaga(payload, settings) {
  const {name: placeName} = payload
  const {centre} = settings

  yield call(setCentreSaga, centre)
  yield call(setTitleSaga, `${i18n.t('header:place_profile')} ${placeName}`, {i18n: true})

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
   yield put(routerActions.meRoute())
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

// NIY
export function* meUsersAddSaga(payload, settings) {
  const {centre} = settings
  const {} = payload

  yield call(setCentreSaga, centre)

  /*
   const {currentUser: {username}} = yield call([client, client.readQuery], {
   query: currentUserQuery
   })

   yield call(setTitleSaga, username)
   */
}
