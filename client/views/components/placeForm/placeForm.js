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
  state = {isLoading: true}

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

  render() {
    const {
      disconnectedPlaces,
      formValues,
      isLoading,
      mustCreate,
      routeType,
      routeTypes,
      t,
      userLocation,
      handleSubmit,
      onMapClick,
      onSuggestSelect
    } = this.props

    if (this.state.isLoading || isLoading) {
      return <Loader active inline="centered"/>
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
