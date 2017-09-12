import api from '../api'

const geoApi = {
  ...api,

  getLocation() {
    this.opts.baseURI = 'http://ip-api.com/json'
    return this.get(`/`)
  },

  geocodeCity(city) {
    this.opts.baseURI = `https://api-adresse.data.gouv.fr/search`
    return this.get(`/?q=${city}`)
  },

  getReverseGeocoding(lat, lng){
    this.opts.baseURI = `https://api-adresse.data.gouv.fr/reverse`
    return this.get(`/?lon=${lng}&lat=${lat}`)
  }
}

export default geoApi
