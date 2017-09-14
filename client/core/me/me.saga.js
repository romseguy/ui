import { call, getContext, fork, put, take, takeEvery } from 'redux-saga/effects'
import { meActions } from 'core/me'
import currentUserQuery from 'graphql/queries/currentUser.query.graphql'
import { query } from 'helpers/apollo'
import watchQuerySaga from 'lib/sagas/watchQuery.saga'


export function* meSaga() {
  const client = yield getContext('client')

  yield fork(watchQuerySaga, {client, query: currentUserQuery}, function* onLoadSaga({currentUser}) {
    yield put(meActions.setCurrentUser(currentUser))
  })

  yield takeEvery(meActions.REFETCH_CURRENT_USER, function*() {
    yield call(query, {client, query: currentUserQuery}, {from: meActions.REFETCH_CURRENT_USER})
  })
}
