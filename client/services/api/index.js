import api from './api'

if (process.env.NODE_ENV !== 'production') {
  window.api = api
}

export default api
