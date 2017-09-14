import { channel } from 'redux-saga'
import { call, getContext, fork, put, take, takeEvery } from 'redux-saga/effects'

import placesQuery from 'graphql/queries/places.query.graphql'

import { query, watchQuery } from 'lib/apollo'
import { placeToNode } from 'lib/factories'

import { mapActions } from 'core/map'


let placesSubscription = null

function* watchPlacesQuerySaga(client) {
  const placesChannel = channel()

  placesSubscription = yield call(watchQuery, {
    channel: placesChannel,
    client,
    query: placesQuery
  })

  while (true) {
    const {type, payload} = yield take(placesChannel)

    switch (type) {
      case 'QUERY_OK':
        const {places} = payload.results.data

        yield put(mapActions.setNodes(places.map((place, nodeId) => placeToNode(nodeId, place))))
        break

      case 'QUERY_NOK':
        if (window.offlineMode) {
          yield put({type: 'OFFLINE_MODE'})
          placesSubscription.unsubscribe()
        }
        break
    }
  }
}

export function* mapSaga() {
  const client = yield getContext('client')

  yield fork(watchPlacesQuerySaga, client)

  yield takeEvery(mapActions.REFETCH_PLACES, function*() {
    query({
      client,
      query: placesQuery
    })
  })
}
