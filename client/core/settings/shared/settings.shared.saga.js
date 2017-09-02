import { call } from 'redux-saga/effects'

import geo from 'utils/api/geo'

export function* getLocationDataSaga(lng, lat) {
  const {body: {features}} = yield call([geo, geo.getReverseGeocoding], lng, lat)

  if (!features.length) {
    return
  }

  const {city, context} = features[0].properties

  const matches = context.match(/[0-9]{2}, ([^,]+)/i)

  return {
    department: matches[1],
    city
  }
}

