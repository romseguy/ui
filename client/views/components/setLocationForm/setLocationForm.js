import { compose } from 'ramda'
import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'
import { translate } from 'react-i18next'
import { reduxForm, Field } from 'redux-form'

import CityField from 'views/components/cityField'
import {
  Button,
  Col,
  Form as UIForm,
  Grid,
  Icon,
  Loader,
  Modal,
  Row
} from 'views/components/layout'
import MapField from 'views/components/mapField'


class SetLocationForm extends Component {
  constructor(props) {
    super(props);
    const {center} = props
    this.state = {
      center,
      isLoading: true,
      zoom: 14
    };
  }

  componentWillReceiveProps({isScriptLoaded, isScriptLoadSucceed}) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        this.setState(p => ({isLoading: false}))
      }
    }
  }

  componentDidMount() {
    const {isScriptLoaded, isScriptLoadSucceed} = this.props
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState(p => ({isLoading: false}))
    }
  }

  handleBoundsChange = ({center, zoom, bounds, initial}) => {
    if (initial) {
      //console.log('Got initial bounds: ', bounds)
    }
    this.setState(p => ({center, zoom}))
  }

  handleSuggestSelect = suggest => {
    const {label, placeId, location, gmaps} = suggest

    if (location && location.lat && location.lng) {
      this.setState(p => ({center: [location.lat, location.lng]}))
    }
  }

  render() {
    const {
      t,
      handleSubmit,
      onSubmit
    } = this.props

    const {
      center,
      isLoading,
      zoom
    } = this.state

    if (isLoading) {
      return <Loader active inline="centered"/>
    }

    return (
      <UIForm onSubmit={(v) => {
        handleSubmit(v)
        onSubmit()
      }}>
        <Modal.Content>
          <Grid>
            <Row>
              <Col mobile={16} tablet={16} computer={5}>
                <label htmlFor="marker">{t('form:setLocation.city')}</label>
              </Col>

              <Col mobile={16} tablet={16} computer={11}>
                <Field
                  name="city"
                  component={CityField}
                  id="city"
                  center={center}
                  t={t}
                  onSuggestSelect={this.handleSuggestSelect}
                />
              </Col>
            </Row>

            <Row>
              <Col mobile={16} tablet={16} computer={5}>
                <label htmlFor="marker">{t('form:setLocation.map')}</label>
              </Col>

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
                  zoom={zoom}
                  onBoundsChanged={this.handleBoundsChange}
                />
              </Col>
            </Row>

          </Grid>
        </Modal.Content>

        <Modal.Actions>
          <Button type="submit">
            <Icon name="checkmark"/> {t('form:setLocation.save')}
            </Button>
        </Modal.Actions>
      </UIForm>
    )
  }
}

export default compose(
  translate(),
  scriptLoader('https://maps.googleapis.com/maps/api/js?key=AIzaSyCZbB5gENry_UJNvwtOStrRqTt7sTi0E9k&libraries=places'),
  reduxForm({
    form: 'Set'
  })
)(SetLocationForm)
