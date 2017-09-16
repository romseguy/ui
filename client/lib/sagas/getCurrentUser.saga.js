import  { call, select, getContext } from 'redux-saga/effects'
import currentUserQuery from 'graphql/queries/currentUser.query.graphql'
import { query } from 'helpers/apollo'
import { getCurrentUser } from 'core/me'


export default function* getCurrentUserSaga() {
  const currentUser = yield select(getCurrentUser)

  if (currentUser) {
    return currentUser
  }

  const client = yield getContext('client')
  let data = null

  try {
    const res = yield call(query, {client, query: currentUserQuery}, {cache: true, from: 'getCurrentUserSaga'})
    data = res.currentUser
  } catch (error) {
    const res = yield call(query, {client, query: currentUserQuery}, {from: 'getCurrentUserSaga'})
    data = res.currentUser
  }

  return data
}
