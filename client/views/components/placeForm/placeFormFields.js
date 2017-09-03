import React, { Component } from 'react'
import { Field } from 'redux-form'

import { keepCities } from 'views/utils/geosuggest'

import GeosuggestField from 'views/components/geosuggestField'
import {
  Button,
  Col,
  Grid,
  Row
} from 'views/components/layout'
import MapField from 'views/components/mapField'


class PlaceFormFields extends Component {
  constructor(props) {
    super(props)
    this.state = {
      center: this.getCenter(props),
      zoom: 14
    }
  }

  componentWillReceiveProps(props) {
    this.setState(p => ({center: this.getCenter(props)}))
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
    const {formValues, userLocation, readOnly, showSelector, t, onMapClick} = this.props
    const {center, zoom} = this.state
    const {action} = formValues

    if (showSelector) {
      if (!action) {
        return null
      }
    }

    return (
      <Grid>
        {action !== 'select' && (
          <Row>
            <Col mobile={16} tablet={16} computer={5}>
              <label htmlFor="name">{t('form:place.name')}</label>
            </Col>

            <Col mobile={16} tablet={16} computer={11}>
              <Field name="title" component="input" type="text" id="name" disabled={readOnly}/>
            </Col>
          </Row>
        )}

        {action !== 'select' && (
          <Row>
            <Col mobile={16} tablet={16} computer={5}>
              <label htmlFor="city">{t('form:place.city')}</label>
            </Col>
            <Col mobile={16} tablet={16} computer={11}>
              <Field
                name="city"
                component={GeosuggestField}
                id="city"
                center={center}
                disabled={readOnly}
                skipSuggest={keepCities}
                t={t}
                onSuggestSelect={this.handleSuggestSelect}
              />
            </Col>
          </Row>
        )}

        {action !== 'select' && (
          <Field
            name="department"
            component="input"
            type="hidden"
          />
        )}

        <Row>
          {action !== 'select' && (
            <Col mobile={16} tablet={16} computer={5}>
              <label htmlFor="marker">{t('form:place.map')}</label>
            </Col>
          )}

          {action !== 'select' && (
            <Col
              mobile={16}
              tablet={16}
              computer={11}
            >
              <Field
                name="marker"
                id="marker"
                component={MapField}
                center={center}
                location={userLocation}
                readOnly={readOnly}
                zoom={zoom}
                onBoundsChanged={this.handleBoundsChange}
                onMapClick={onMapClick}
              />
            </Col>
          )}
        </Row>

        <Row>
          <Col>
            <Button type="submit">{t('form:place.save')}</Button>
          </Col>
        </Row>

      </Grid>
    )
  }
}

export default PlaceFormFields
