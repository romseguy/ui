import { call, getContext, fork, put, take, takeEvery } from 'redux-saga/effects'

import placesQuery from 'graphql/queries/places.query.graphql'

import { query } from 'helpers/apollo'
import { placeToNode } from 'lib/factories'

import watchQuerySaga from 'lib/sagas/watchQuery.saga'

import { mapActions } from 'core/map'


export function* mapSaga() {
  const client = yield getContext('client')

  yield fork(watchQuerySaga, {client, query: placesQuery}, function* onLoadSaga({places}) {
    yield put(mapActions.setNodes(places.map((place, nodeId) => placeToNode(nodeId, place))))
  })

  yield takeEvery(mapActions.REFETCH_PLACES, function*() {
    yield call(query, {client, query: placesQuery}, {from: mapActions.REFETCH_PLACES})
  })
}
