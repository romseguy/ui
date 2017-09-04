import React, { Component } from 'react'
import { Field } from 'redux-form'

import { PlaceFormBreakpoints as breakpoints } from 'views/utils/form/responsive'
import { keepCities } from 'views/utils/geosuggest'
import { required } from 'views/utils/form/validators'

import GeosuggestField from 'views/components/geosuggestField'
import InputField from 'views/components/inputField'
import { Grid } from 'views/components/layout'
import MapField from 'views/components/mapField'


class PlaceFormFields extends Component {
  constructor(props) {
    super(props)
    this.state = {
      center: this.getCenter(props),
      zoom: 14
    }
  }

  componentDidMount() {
    this.titleInput.getRenderedComponent().focusInput()
  }

  componentWillReceiveProps(nextProps) {
    this.setState(p => ({center: this.getCenter(nextProps)}))
  }

  getCenter(props = this.props) {
    const {
      formValues,
      userLocation
    } = props

    const {marker} = formValues
    const hasMarker = Array.isArray(marker) && marker.length === 2
    let latitude = hasMarker ? marker[0] : userLocation.lat
    let longitude = hasMarker ? marker[1] : userLocation.lng

    return [latitude, longitude]
  }

  handleBoundsChange = ({center, zoom, bounds, initial}) => {
    if (initial) {
      //console.log('Got initial bounds: ', bounds)
    }
    this.setState(p => ({center, zoom}))
  }

  handleSuggestSelect = suggest => {
    const {onSuggestSelect} = this.props
    const {label, placeId, location, gmaps} = suggest

    if (location && location.lat && location.lng) {
      this.setState(p => ({center: [location.lat, location.lng]}))
    }

    typeof onSuggestSelect === 'function' && onSuggestSelect(suggest)
  }

  render() {
    const {formValues, userLocation, readOnly, t, onMapClick} = this.props
    const {center, zoom} = this.state

    return (
      <Grid>
        <Field
          name="title"
          component={InputField}
          type="text"
          breakpoints={breakpoints}
          label={t('form:place.name')}
          ref={node => this.titleInput = node}
          withRef
          validate={[required({msg: t('errors:required')})]}
        />

        <Field
          name="city"
          component={GeosuggestField}
          breakpoints={breakpoints}
          label={t('form:place.city')}
          center={center}
          disabled={readOnly}
          placeholder={t('geosuggest_placeholder')}
          skipSuggest={keepCities}
          ref={node => this.cityInput = node}
          withRef
          validate={[required({msg: t('errors:required')})]}
          onSuggestSelect={this.handleSuggestSelect}
        />

        <Field
          name="department"
          component="input"
          type="hidden"
        />

        <Field
          name="marker"
          component={MapField}
          breakpoints={breakpoints}
          center={center}
          label={t('form:place.map')}
          location={userLocation}
          readOnly={readOnly}
          zoom={zoom}
          onBoundsChanged={this.handleBoundsChange}
          onMapClick={onMapClick}
        />

      </Grid>
    )
  }
}

export default PlaceFormFields
