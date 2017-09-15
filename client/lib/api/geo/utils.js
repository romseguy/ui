import debug from 'helpers/debug'


function apiResultIsValid(res) {
  if (!res) {
    debug('no result from api')
    return false
  }
  else if (!res.body) {
    debug('no body')
    return false
  }
  else if (!res.body.features || !res.body.features.length) {
    debug('no features')
    return false
  }

  return true
}

export function getGeocodedLocation(res) {
  if (!apiResultIsValid(res)) {
    return undefined
  }
  const {body: {features}} = res
  const [lng, lat] = features[0].geometry.coordinates

  return {lat, lng}
}

export function getGeocodedDepartment(res) {
  const context = getGeocodedProperty(res, 'context')
  const matches = context.match(/[0-9]{2}, ([^,]+)/i)

  return matches[1]
}

export function getGeocodedProperty(res, property) {
  if (!apiResultIsValid(res)) {
    return undefined
  }

  const {body: {features}} = res

  return features[0].properties[property]
}
