import Frisbee from 'frisbee'

const frisbee = new Frisbee({
  baseURI: 'http://localhost:8080',
  headers: {
    Accept: 'application/json'
  }
})

export default {
  ...frisbee,

  get(path, options = {}) {
    return frisbee.get(path, {
      'Content-Type': 'application/json',
      ...options
    })
  },

  post(path, options) {
    return frisbee.post(path, options)
  },

  put(path, options) {
    return frisbee.put(path, options)
  },

  del(path, options) {
    return frisbee.del(path, options)
  },

  getResponseData(response, key) {
    if (!response) {
      return undefined
    }

    const body = response.datas || response

    if (!key) {
      return body
    }

    return body[key]
  }
}
