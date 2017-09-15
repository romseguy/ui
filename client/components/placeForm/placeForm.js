import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'
import { translate } from 'react-i18next'
import { compose, pure } from 'recompose'
import { reduxForm } from 'redux-form'

import {
  Button,
  Form as UIForm,
  Loader
} from 'components/layout'

import PlaceFormHeader from './placeFormHeader'
import PlaceFormLayout from './placeFormLayout'
import PlaceFormFields from './placeFormFields'
import PlaceFormSelectFields from './placeFormSelectFields'
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

  handleSaveClick = event => {
    const {
      onSubmit,
      handleSubmit
    } = this.props

    handleSubmit(event, values => onSubmit(values))
  }

  handleViewClick = event => {
    const {
      formValues,
      onViewClick
    } = this.props

    typeof onViewClick === 'function' && onViewClick(formValues)
  }

  render() {
    const {
      disconnectedPlaces,
      formValues,
      routeType,
      routeTypes,
      submitting,
      t,
      title,
      userLocation,
      handleSubmit,
      onMapClick,
      onSubmit,
      onSuggestSelect
    } = this.props

    const {
      isLoading
    } = this.state

    // google lib failed loading: warn the user
    if (process.env.NODE_ENV !== 'development' && isLoading === null) {
      return <span>{t('form:failed_loading')}</span>
    }

    const showSelector = isLoading || routeType === routeTypes.ME_PLACES_ADD && disconnectedPlaces.length > 0
    const showSelectFields = !isLoading && formValues.action === 'select'
    const showFields = !isLoading && (formValues.action === 'create' || routeType === routeTypes.ME_PLACE_EDIT || routeType === routeTypes.ME_PLACES_ADD && !disconnectedPlaces.length)

    return (
      <PlaceFormLayout fluid>
        <PlaceFormHeader
          routeType={routeType}
          routeTypes={routeTypes}
          t={t}
          title={title}
        />

        <UIForm loading={isLoading}>
          {showSelector && (
            <PlaceFormSelector t={t}/>
          )}

          {showSelectFields && (
            <PlaceFormSelectFields
              disconnectedPlaces={disconnectedPlaces}
              formValues={formValues}
              submitting={submitting}
              t={t}
              onSaveClick={this.handleSaveClick}
              onViewClick={this.handleViewClick}
            />
          )}

          {showFields && (
            <PlaceFormFields
              userLocation={userLocation}
              formValues={formValues}
              readOnly={false}
              submitting={submitting}
              t={t}
              onMapClick={onMapClick}
              onSaveClick={this.handleSaveClick}
              onSuggestSelect={onSuggestSelect}
            />
          )}
        </UIForm>
      </PlaceFormLayout>
    )
  }
}

export default compose(
  scriptLoader('https://maps.googleapis.com/maps/api/js?key=AIzaSyCZbB5gENry_UJNvwtOStrRqTt7sTi0E9k&libraries=places'),
  reduxForm({
    form: 'PlaceForm',
    enableReinitialize: true
  }),
  translate(),
  pure
)(PlaceForm)
