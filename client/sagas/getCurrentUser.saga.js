import  { call, getContext } from 'redux-saga/effects'

import currentUserQuery from 'graphql/queries/currentUser.query.graphql'

import { query } from 'lib/apollo'


export default function* getCurrentUserSaga() {
  const client = yield getContext('client')
  let data = null

  try {
    data = yield call(query, {client, query: currentUserQuery}, {cache: true})
  } catch (error) {
    data = yield call(query, {client, query: currentUserQuery})
  }

  if (data) {
    return data.currentUser
  }

  return null
}
