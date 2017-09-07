import { compose } from 'ramda'
import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'
import { reduxForm } from 'redux-form'

import {
  Button,
  Form as UIForm,
  Loader
} from 'views/components/layout'

import PlaceFormFields from './placeFormFields'
import PlaceFormSelector from './placeFormSelector'


class PlaceForm extends Component {

  state = {
    isLoading: true
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

  render() {
    const {
      disconnectedPlaces,
      formValues,
      mustCreate,
      routeType,
      routeTypes,
      t,
      userLocation,
      handleSubmit,
      onMapClick,
      onSuggestSelect
    } = this.props

    const {
      isLoading
    } = this.state

    if (isLoading) {
      return <Loader active inline="centered"/>
    } else if (process.env.NODE_ENV !== 'development' && isLoading === null) {
      return <span>{t('form:failed_loading')}</span>
    }

    let readOnly = false

    const showSelector = routeType === routeTypes.ME_PLACES_ADD && !mustCreate
    const showFields = !showSelector || formValues.action === 'create'
    const showSubmit = !showSelector || !!formValues.action

    return (
      <UIForm
        loading={false}
        onSubmit={handleSubmit}
      >
        {showSelector && (
          <PlaceFormSelector
            disconnectedPlaces={disconnectedPlaces}
            formValues={formValues}
            t={t}
          />
        )}

        {showFields && (
          <PlaceFormFields
            userLocation={userLocation}
            formValues={formValues}
            readOnly={readOnly}
            t={t}
            onMapClick={onMapClick}
            onSuggestSelect={onSuggestSelect}
          />
        )}

        {showSubmit && (
          <Button type="submit">{t('form:place.save')}</Button>
        )}
      </UIForm>
    )
  }
}

export default compose(
  scriptLoader('https://maps.googleapis.com/maps/api/js?key=AIzaSyCZbB5gENry_UJNvwtOStrRqTt7sTi0E9k&libraries=places'),
  reduxForm({
    form: 'PlaceForm',
    enableReinitialize: true
  })
)(PlaceForm)
