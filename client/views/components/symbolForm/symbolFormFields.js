import React, { Component } from 'react'
import Geosuggest from 'react-geosuggest'
import { Field } from 'redux-form'
import './geosuggest.scss'

import {
  Button,
  Col,
  Grid,
  Row
} from 'views/components/layout'

import SymbolFormMap from './symbolFormMap'


class CityField extends Component {
  render() {
    const {disabled, id, input, center, meta, t, onSuggestSelect} = this.props

    return (
      <Geosuggest
        ref={el => this._geoSuggest = el}
        id={id}
        initialValue={input.value}
        location={new google.maps.LatLng(center[0], center[1])}
        disabled={disabled}
        symbolholder={t('geosuggest_symbolholder')}
        radius="20"
        skipSuggest={suggest => {
          // keep cities only
          return !suggest.types.includes('locality')
        }}
        onChange={input.onChange}
        onSuggestSelect={onSuggestSelect}
      />
    )
  }
}

class SymbolFormFields extends Component {
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
    const {label, symbolId, location, gmaps} = suggest

    onSuggestSelect(suggest)

    if (location && location.lat && location.lng) {
      this.setState(p => ({center: [location.lat, location.lng]}))
    }
  }

  render() {
    const {formValues, userLocation, readOnly, showSelector, t} = this.props
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
              <label htmlFor="name">Nom du lieu :</label>
            </Col>

            <Col mobile={16} tablet={16} computer={11}>
              <Field name="title" component="input" type="text" id="name" disabled={readOnly}/>
            </Col>
          </Row>
        )}

        {action !== 'select' && (
          <Row>
            <Col mobile={16} tablet={16} computer={5}>
              <label htmlFor="city">Ville :</label>
            </Col>
            <Col mobile={16} tablet={16} computer={11}>
              <Field
                name="city"
                component={CityField}
                id="city"
                center={center}
                disabled={readOnly}
                t={t}
                onSuggestSelect={this.handleSuggestSelect}
              />
            </Col>
          </Row>
        )}

        <Row>
          {action !== 'select' && (
            <Col mobile={16} tablet={16} computer={5}>
              <label htmlFor="marker">Cliquez à l'endroit où est situé le lieu :</label>
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
                component={SymbolFormMap}
                center={center}
                location={userLocation}
                readOnly={readOnly}
                zoom={zoom}
                onBoundsChanged={this.handleBoundsChange}
              />
            </Col>
          )}
        </Row>

        <Row>
          <Col>
            <Button type="submit">Enregistrer</Button>
          </Col>
        </Row>

      </Grid>
    )
  }
}

export default SymbolFormFields
