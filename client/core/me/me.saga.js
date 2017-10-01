import { call, getContext, fork, put, takeEvery } from 'redux-saga/effects'
import { meActions } from 'core/me'
import currentUserQuery from 'lib/graphql/queries/currentUser.query.graphql'
import { query } from 'lib/helpers/apollo'
import { watchQuerySaga } from 'core/shared/sagas'


export function* meSaga() {

  yield takeEvery(meActions.REFETCH_CURRENT_USER, function*() {
    yield call(query, {client, query: currentUserQuery}, {from: meActions.REFETCH_CURRENT_USER})
  })
}
