import { compose } from 'ramda'
import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'
import { translate } from 'react-i18next'
import { reduxForm, Field } from 'redux-form'

import { keepCities } from 'views/utils/geosuggest'
import { LocationFormBreakpoints as breakpoints } from 'views/utils/form/responsive'

import GeosuggestField from 'views/components/geosuggestField'
import {
  Button,
  Col,
  Form as UIForm,
  Grid,
  Icon,
  Modal,
  Row
} from 'views/components/layout'


class SetLocationForm extends Component {
  constructor(props) {
    super(props);
    const {center} = props
    this.state = {
      center,
      isLoading: true
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
      t,
      handleSubmit,
      onSubmit
    } = this.props

    const {
      center,
      isLoading
    } = this.state

    return (
      <UIForm
        onSubmit={handleSubmit(onSubmit)}
      >
        <Modal.Content>
          {isLoading ? (
            <span>{t('loading')}</span>
          ) : (
            <Grid>
              <Row>
                <Col mobile={16} tablet={16} computer={11}>
                  <Field
                    name="city"
                    component={GeosuggestField}
                    breakpoints={breakpoints}
                    id="city"
                    center={center}
                    label={t('form:setLocation.city')}
                    skipSuggest={keepCities}
                    t={t}
                    onSuggestSelect={this.handleSuggestSelect}
                  />
                </Col>

                <Field
                  name="department"
                  component="input"
                  type="hidden"
                />

                <Field
                  name="marker"
                  component="input"
                  type="hidden"
                />
              </Row>
            </Grid>
          )}
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
    form: 'SetLocationForm'
  })
)(SetLocationForm)
