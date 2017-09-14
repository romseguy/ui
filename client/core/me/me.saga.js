import { channel } from 'redux-saga'
import { call, getContext, fork, put, take, takeEvery } from 'redux-saga/effects'

import currentUserQuery from 'graphql/queries/currentUser.query.graphql'

import { query, watchQuery } from 'lib/apollo'

import { meActions } from 'core/me'


let currentUserSubscription = null

function* watchCurrentUserQuerySaga(client) {
  const currentUserChannel = channel()

  currentUserSubscription = yield call(watchQuery, {
    channel: currentUserChannel,
    client,
    query: currentUserQuery
  })

  while (true) {
    const {type, payload} = yield take(currentUserChannel)

    switch (type) {
      case 'QUERY_OK':
        const {currentUser} = payload.results.data

        yield put(meActions.setCurrentUser(currentUser))
        break

      case 'QUERY_NOK':
        if (window.offlineMode) {
          yield put({type: 'OFFLINE_MODE'})
          currentUserSubscription.unsubscribe()
        }
        break
    }
  }
}

export function* meSaga() {
  const client = yield getContext('client')

  yield fork(watchCurrentUserQuerySaga, client)

  yield takeEvery(meActions.REFETCH_CURRENT_USER, function*() {
    query({
      client,
      query: currentUserQuery
    })
  })
}
