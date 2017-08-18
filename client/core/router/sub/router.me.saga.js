import { call, put, select, take } from 'redux-saga/effects'

import { client } from 'core/apollo'
import { mainPanelActions, getCanvasNodesSaga } from 'core/mainPanel'
import { routerActions } from 'core/router'

import placeQuery from 'views/containers/place/place.query.graphql'
import currentUserQuery from 'views/containers/header/currentUser.query.graphql'

import { setCentreSaga, setTitleSaga } from './router.sub.saga'


export function* meSaga(payload, settings) {
  const {centre} = settings
  const {noReset} = payload
  yield call(setCentreSaga, centre)

  if (!noReset) {
    yield put(mainPanelActions.setNodes([]))
  }

  const {currentUser: {username}} = yield call([client, client.readQuery], {
    query: currentUserQuery
  })

  yield call(setTitleSaga, username)
}

export function* mePlacesAddSaga(payload, settings) {
  const {centre} = settings
  yield call(setCentreSaga, centre)
}

export function* mePlaceViewSaga(payload, settings) {
  const {centre} = settings
  const {name, noReset} = payload

  yield call(setCentreSaga, centre)

  if (!noReset) {
    yield put(mainPanelActions.setNodes([]))
  }

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
          yield put(routerActions.meRoute())
        } else {
          const {city, department} = result.data.place
          yield call(setTitleSaga, `${name} à ${city}, ${department}`)
        }
      }
    }
  }
}

export function* mePlaceEditSaga(payload, settings) {
  const {centre} = settings
  const {name} = payload
  let keepLooping = true

  yield call(setCentreSaga, centre)
  const nodes = yield call(getCanvasNodesSaga)
  yield put(mainPanelActions.setSelectedNodeId(nodes.find(node => node.name === name).id))

  // todo: cleanup (see apollo client issues)
  try {
    const {place: {city, department}} = yield call([client, client.readQuery], {
      query: placeQuery,
      variables: {title: name},
    })
    yield call(setTitleSaga, `${name} à ${city}, ${department}`)

  } catch (e) {
    while (keepLooping) {
      const {operationName, result} = yield take(['APOLLO_QUERY_RESULT', 'APOLLO_QUERY_RESULT_CLIENT'])

      if (['placeForm', 'place'].includes(operationName)) {
        keepLooping = false

        if (!result.data || !result.data.place) {
          yield put(routerActions.meRoute())
        } else {
          const {city, department} = result.data.place
          yield call(setTitleSaga, `${name} à ${city}, ${department}`)
        }
      }
    }
  }
}
