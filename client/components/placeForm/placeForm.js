import React from 'react'
import { translate } from 'react-i18next'
import { compose, pure, withHandlers } from 'recompose'
import { reduxForm } from 'redux-form'

import { Form as UIForm } from 'components/layout'

import PlaceFormHeader from './placeFormHeader'
import PlaceFormLayout from './placeFormLayout'
import PlaceFormFields from './placeFormFields'
import PlaceFormSelectFields from './placeFormSelectFields'
import PlaceFormSelector from './placeFormSelector'


const handlers = {
  onSaveClick: props => event => {
    const {
      onSubmit,
      handleSubmit
    } = props

    handleSubmit(event, values => onSubmit(values))
  },

  onViewClick: props => event => {
    const {
      formValues,
      onViewClick
    } = props

    typeof onViewClick === 'function' && onViewClick(formValues)
  }
}

function PlaceForm(props) {
  const {
    disconnectedPlaces,
    formValues,
    isLoading,
    routeType,
    routeTypes,
    serverErrors,
    setIsLoading,
    submitting,
    t,
    title,
    userLocation,
    onMapClick,
    onSaveClick,
    onSuggestSelect,
    onViewClick
  } = props

  const hasServerErrors = Array.isArray(serverErrors) && serverErrors.length > 0
  const showSelector = isLoading || routeType === routeTypes.ME_PLACES_ADD && disconnectedPlaces.length > 0
  const showSelectFields = !isLoading && formValues.action === 'select'

  let showFields = false

  if (formValues.action === 'create') {
    showFields = true
  }
  else if (formValues.action === 'select') {
    showFields = false
  }
  else if (!isLoading) {
    if (routeType === routeTypes.ME_PLACE_EDIT) {
      showFields = true
    } else if (routeType === routeTypes.ME_PLACES_ADD && !disconnectedPlaces.length) {
      showFields = true
    }
  }

  return (
    <PlaceFormLayout fluid>
      <PlaceFormHeader
        routeType={routeType}
        routeTypes={routeTypes}
        t={t}
        title={title}
      />

      <UIForm
        error={hasServerErrors}
        loading={isLoading}
      >
        {showSelector && (
          <PlaceFormSelector t={t}/>
        )}

        {showSelectFields && (
          <PlaceFormSelectFields
            disconnectedPlaces={disconnectedPlaces}
            formValues={formValues}
            submitting={submitting}
            t={t}
            onSaveClick={onSaveClick}
            onViewClick={onViewClick}
          />
        )}

        {showFields && (
          <PlaceFormFields
            formValues={formValues}
            hasServerErrors={hasServerErrors}
            readOnly={false}
            serverErrors={serverErrors}
            setIsLoading={setIsLoading}
            submitting={submitting}
            t={t}
            userLocation={userLocation}
            onMapClick={onMapClick}
            onSaveClick={onSaveClick}
            onSuggestSelect={onSuggestSelect}
          />
        )}
      </UIForm>
    </PlaceFormLayout>
  )
}

export default compose(
  reduxForm({
    form: 'PlaceForm',
    enableReinitialize: true
  }),
  translate(),
  withHandlers(handlers),
  pure
)(PlaceForm)
