import { call, getContext, take } from 'redux-saga/effects'
import currentUserQuery from 'graphql/queries/currentUser.query.graphql'


export default function* getCurrentUserSaga() {
  try {
    const client = yield getContext('client')

    const result = yield call([client, client.readQuery], {
      query: currentUserQuery
    })

    return result ? result.currentUser : null
  } catch (e) {
    while (true) {
      const {operationName, result} = yield take(['APOLLO_QUERY_RESULT', 'APOLLO_QUERY_RESULT_CLIENT'])
      if (['currentUser'].includes(operationName)) {
        return result.data ? result.data.currentUser : null
      }
    }
  }
}
