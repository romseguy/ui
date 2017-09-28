import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'
import { compose } from 'recompose'
import { Field } from 'redux-form'

import keepCities from 'helpers/keepCities'
import { required } from 'helpers/form/validators'
import { PlaceFormBreakpoints as breakpoints } from 'lib/maps/breakpoints'

import GeosuggestField from 'components/geosuggestField'
import InputField from 'components/inputField'
import { Button, NoPadCol as Col, Grid, Message, Row } from 'components/layout'
import MapField from 'components/mapField'


class PlaceFormFields extends Component {
  state = {
    center: null,
    isLoading: true,
    zoom: 14
  }

  componentDidMount() {
    const {setIsScriptLoading} = this.props
    setIsScriptLoading(true)
  }

  componentWillReceiveProps(nextProps) {
    const {isScriptLoaded, isScriptLoadSucceed, setIsScriptLoading} = nextProps

    if (isScriptLoaded) { // script finished loading
      setIsScriptLoading(false)
      this.setState({isLoading: false})

      if (isScriptLoadSucceed) {
        setIsScriptLoading(false)
      } else {
        setIsScriptLoading(null)
      }
    }
  }

  getMapCenter() {
    const {
      center
    } = this.state

    if (center) {
      return center
    }

    const {
      formValues,
      userLocation
    } = this.props

    const {
      marker
    } = formValues || {}

    const hasMarker = Array.isArray(marker) && marker.length === 2
    let latitude = hasMarker ? marker[0] : userLocation.lat
    let longitude = hasMarker ? marker[1] : userLocation.lng

    return [latitude, longitude]
  }

  handleBoundsChange = ({center, zoom, bounds, initial}) => {
    if (initial) {
      // got initial bounds
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
    const {
      hasServerErrors,
      isScriptLoading,
      readOnly,
      serverErrors,
      submitting,
      t,
      userLocation,
      valid,
      onMapClick,
      onSaveClick
    } = this.props

    const {
      isLoading,
      zoom
    } = this.state

    if (isLoading) {
      return null
    }

    // google lib failed loading: warn the user
    if (isScriptLoading === null && process.env.NODE_ENV !== 'development') {
      return <span>{t('form:failed_loading')}</span>
    }

    const center = this.getMapCenter(this.props)

    return (
      <Grid verticalAlign="middle">
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

        {hasServerErrors && (
          <Row>
            <Col width={16}>
              <Message
                size="tiny"
                error
              >
                <Message.Header>{t('errors:place.fixForm')}</Message.Header>
                <Message.List>
                  {serverErrors.map(({message}, i) => (
                    <Message.Item key={`serverError-${i}`}>
                      {message}
                    </Message.Item>
                  ))}
                </Message.List>
              </Message>
            </Col>
          </Row>
        )}

        <Row>
          <Col>
            <Button
              disabled={submitting || !valid}
              positive
              onClick={onSaveClick}
            >{
              t('form:place.save')}
            </Button>
          </Col>
        </Row>

      </Grid>
    )
  }
}

export default compose(
  scriptLoader('https://maps.googleapis.com/maps/api/js?key=AIzaSyCZbB5gENry_UJNvwtOStrRqTt7sTi0E9k&libraries=places')
)(PlaceFormFields)
