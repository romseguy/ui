import { call, getContext, fork, put, take, takeEvery } from 'redux-saga/effects'
import { query } from 'helpers/apollo'
import { mapActions } from 'core/map'
import placesQuery from 'graphql/queries/places.query.graphql'


export function* mapSaga() {
  const client = yield getContext('client')

  yield takeEvery(mapActions.REFETCH_PLACES, function*() {
    yield call(query, {client, query: placesQuery}, {from: mapActions.REFETCH_PLACES})
  })
}
