import api from 'services/api'

const geoApi = {
  ...api,

  getLocation() {
    this.opts.baseURI = 'http://ip-api.com/json'
    return this.get(`/`)
  },

  getReverseGeocoding(lng, lat){
    this.opts.baseURI = `http://api-adresse.data.gouv.fr/reverse`
    return this.get(`/?lon=${lng}&lat=${lat}`)
  }
}

export default geoApi
