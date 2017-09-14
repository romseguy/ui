import { channel } from 'redux-saga'
import { call, take } from 'redux-saga/effects'

import { watchQuery } from 'helpers/apollo'


export default function* watchQuerySaga(config, onLoadSaga, onErrorSaga) {
  const queryChannel = config.channel || channel()
  const subscription = yield call(watchQuery, {...config, channel: queryChannel})

  while (true) {
    const {type, payload} = yield take(queryChannel)

    switch (type) {
      case 'QUERY_OK':
        if (typeof onLoadSaga === 'function') {
          yield call(onLoadSaga, payload.results.data)
        }
        break

      case 'QUERY_NOK':
        if (typeof onErrorSaga === 'function') {
          yield call(onErrorSaga, payload)
        }
        break
    }
  }
}
