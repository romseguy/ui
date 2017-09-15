import { call, getContext, fork, put, take, takeEvery } from 'redux-saga/effects'
import { query } from 'helpers/apollo'
import { canvasActions } from 'core/canvas'
import myPlacesQuery from 'graphql/queries/myPlaces.query.graphql'


export function* canvasSaga() {
  const client = yield getContext('client')
  
  yield takeEvery(canvasActions.REFETCH_MY_PLACES, function*() {
    yield call(query, {client, query: myPlacesQuery}, {from: canvasActions.REFETCH_MY_PLACES})
  })
}
