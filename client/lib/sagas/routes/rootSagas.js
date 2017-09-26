import { channel } from 'redux-saga'
import { call, fork, put, select, take } from 'redux-saga/effects'

import { query } from 'helpers/apollo'
import { personToNode, placeToNode } from 'lib/factories'
import { setDepartmentTitleSaga, setTitleSaga, toggleAuthModalSaga } from 'lib/sagas'

import { canvasActions } from 'core/canvas'
import { mapActions } from 'core/map'
import { routerActions } from 'core/router'

import currentUserQuery from 'graphql/queries/currentUser.query.graphql'
import placeQuery from 'graphql/queries/place.query.graphql'
import placesQuery from 'graphql/queries/places.query.graphql'
import logoutMutation from 'graphql/mutations/logout.mutation.graphql'


function* setNodesFromPlaceSaga(client, placeTitle) {
  yield put(mapActions.setNodesLoading(true))

  const {place} = yield call(query, {
    client,
    query: placeQuery,
    variables: {title: placeTitle}
  }, {
    cache: true,
    from: 'setNodesFromPlaceSaga'
  })

  yield put(canvasActions.setNodes(place.users.map((person, nodeId) => personToNode(nodeId, person))))
  yield put(canvasActions.setNodesLoading(false))
}

function* setNodesFromPlacesSaga(client) {
  yield put(mapActions.setNodesLoading(true))

  const {places} = yield call(query, {client, query: placesQuery}, {from: '/'})

  yield put(mapActions.setNodes(places.map((place, nodeId) => placeToNode(nodeId, place))))
  yield put(mapActions.setNodesLoading(false))
}

export function* rootSaga(payload, settings) {
  const {client, onEnter, prevRoute} = settings

  /*  if (onEnter || [
   routerActions.ME,
   routerActions.ME_PLACE_VIEW,
   routerActions.ME_P
   ].includes(prevRoute.type)) {*/
  yield call(setNodesFromPlacesSaga, client)
  //}

  yield call(setDepartmentTitleSaga)
}

export function* aboutSaga(payload, settings) {
  const {i18n} = settings
  yield call(setTitleSaga, () => i18n.t('about'), {i18n: true})
}

export function* authSaga(payload, settings) {
  const {currentUser, prevRoute} = settings

  if (currentUser) {
    yield put(routerActions.rootRoute())
    return
  }

  const onCloseChannel = channel()

  yield call(toggleAuthModalSaga, {
    modalProps: {
      onClose: () => {
        onCloseChannel.put({})
      }
    }
  })

  yield fork(function*() {
    yield take(onCloseChannel)

    onCloseChannel.close()

    yield call(toggleAuthModalSaga)

    if (prevRoute.type === '') {
      yield put(routerActions.rootRoute())
    } else {
      if (prevRoute.requiresAuth) {
        yield put(routerActions.rootRoute())
      } else {
        yield put({type: prevRoute.type})
      }
    }
  })

  yield call(setDepartmentTitleSaga)
}

export function* logoutSaga(payload, settings) {
  const {currentUser, client} = settings

  if (currentUser) {
    yield call([client, client.mutate], {
      mutation: logoutMutation,
      refetchQueries: [{
        query: currentUserQuery
      }]
    })
  }

  yield put(routerActions.rootRoute())
}

export function* placeViewSaga(payload, settings) {
  const {} = payload
  const {client} = settings
  const placeTitle = decodeURIComponent(payload.placeTitle)

  yield call(setNodesFromPlaceSaga, client, placeTitle)
  yield call(setTitleSaga, `${placeTitle}`)
}

export function* placeSymbolsAddSaga(payload, settings) {
  const {} = payload
  const {client, i18n} = settings

  const placeTitle = decodeURIComponent(payload.placeTitle)
  const prefix = `form:symbol.${payload.symbolType.toLowerCase()}`
  const title = i18n.t(
    `${prefix}.header.add`,
    {
      symbolType: i18n.t(`${prefix}.label`),
      placeTitle
    }
  )

  yield call(setNodesFromPlaceSaga, client, placeTitle)
  yield call(setTitleSaga, title, {i18n: true})
}

export function* placeSymbolEditSaga(payload, settings) {
  const {} = payload
  const {i18n} = settings

  const placeTitle = decodeURIComponent(payload.placeTitle)
  const prefix = `form:symbol.${payload.symbolType.toLowerCase()}`
  const title = i18n.t(
    `${prefix}.header.edit`,
    {
      symbolType: i18n.t(`${prefix}.label`),
      placeTitle
    }
  )

  yield call(setNodesFromPlaceSaga, client, placeTitle)
  yield call(setTitleSaga, title, {i18n: true})
}

export function* userViewSaga(payload, settings) {
  const {name: username} = payload
  const {i18n} = settings

  yield call(setTitleSaga, `${username}`)
}

export function* notFoundSaga() {
  yield call(setDepartmentTitleSaga)
}
