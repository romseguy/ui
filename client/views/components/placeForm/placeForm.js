import { compose } from 'ramda'
import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'
import { reduxForm } from 'redux-form'

import { Form as UIForm, Loader } from 'views/components/layout'

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
    let showSelector = false

    switch (routeType) {
      case routeTypes.ME_PLACES_ADD:
        if (!mustCreate) {
          showSelector = true
        }
        break
    }

    return (
      <div>
        {showSelector && (
          <UIForm
            loading={false}
            onSubmit={handleSubmit}
          >
            <PlaceFormSelector
              disconnectedPlaces={disconnectedPlaces}
              formValues={formValues}
              t={t}
            />
          </UIForm>
        )}

        <UIForm
          loading={false}
          onSubmit={handleSubmit}
        >
          <PlaceFormFields
            userLocation={userLocation}
            formValues={formValues}
            readOnly={readOnly}
            showSelector={showSelector}
            t={t}
            onMapClick={onMapClick}
            onSuggestSelect={onSuggestSelect}
          />
        </UIForm>
      </div>
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
