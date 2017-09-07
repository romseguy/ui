import { compose } from 'ramda'
import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'
import { reduxForm, Field } from 'redux-form'

import { keepCities } from 'views/utils/geosuggest'
import { LocationFormBreakpoints as breakpoints } from 'views/utils/form/responsive'

import GeosuggestField from 'views/components/geosuggestField'
import Icon from 'views/components/icon'
import {
  Button,
  Col,
  Form as UIForm,
  Grid,
  Loader,
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

  componentDidMount() {
    const {isLoading, isScriptLoaded, isScriptLoadSucceed} = this.props

    if (!isLoading) { // parent data container finished loading
      if (isScriptLoaded) {
        if (isScriptLoadSucceed) {
          this.setIsLoading(false)
        } else {
          this.setIsLoading(null)
        }
      }
    }
  }

  componentWillReceiveProps({isLoading, isScriptLoaded, isScriptLoadSucceed}) {
    if (!isLoading) { // parent data container finished loading
      if (isScriptLoaded) { // script finished loading
        if (isScriptLoadSucceed) {
          this.setIsLoading(false)
        } else {
          this.setIsLoading(null)
        }
      }
    }
  }

  setIsLoading(isLoading) {
    this.setState(p => ({isLoading}))
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

    let content = null

    if (isLoading) {
      content = <Loader active inline="centered"/>
    }  else if (process.env.NODE_ENV !== 'development' && isLoading === null) {
      content = <span>{t('form:failed_loading')}</span>
    } else {
      content = (
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
      )
    }

    return (
      <UIForm
        onSubmit={handleSubmit(onSubmit)}
      >
        <Modal.Content>
          {content}
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
  scriptLoader('https://maps.googleapis.com/maps/api/js?key=AIzaSyCZbB5gENry_UJNvwtOStrRqTt7sTi0E9k&libraries=places'),
  reduxForm({
    form: 'SetLocationForm'
  })
)(SetLocationForm)
