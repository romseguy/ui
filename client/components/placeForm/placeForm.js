import React from 'react'
import { compose, pure, withHandlers } from 'recompose'
import { reduxForm } from 'redux-form'

import { Form as UIForm } from 'components/layout'

import PlaceFormFields from './placeFormFields'
import PlaceFormHeader from './placeFormHeader'
import PlaceFormLayout from './placeFormLayout'
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
    isScriptLoading,
    routeType,
    routeTypes,
    serverErrors,
    setIsScriptLoading,
    submitting,
    t,
    title,
    valid,
    userLocation,
    onMapClick,
    onSaveClick,
    onSuggestSelect,
    onViewClick
  } = props

  const hasServerErrors = Array.isArray(serverErrors) && serverErrors.length > 0
  const showSelectFields = !isLoading && formValues.action === 'select'

  let showFields = false
  let showSelector = false

  if (formValues.action === 'create') {
    showFields = true
    showSelector = true
  }
  else if (formValues.action === 'select') {
    showFields = false
    showSelector = true
  }
  else {
    if (routeType === routeTypes.ME_PLACE_EDIT) {
      showSelector = false
      showFields = true
    } else if (routeType === routeTypes.ME_PLACES_ADD) {
      if (isLoading) {
        showSelector = true
      } else if (isScriptLoading) {
        showFields = true
      }
      else {
        if (disconnectedPlaces) {
          showSelector = true
        } else {
          showFields = true
        }
      }
    }
  }

  return (
    <PlaceFormLayout fluid>
      <PlaceFormHeader
        isLoading={isLoading}
        t={t}
        title={title}
      />

      <UIForm
        error={hasServerErrors}
        loading={isLoading || isScriptLoading}
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
            valid={valid}
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
            setIsScriptLoading={setIsScriptLoading}
            submitting={submitting}
            t={t}
            valid={valid}
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
  withHandlers(handlers),
  pure
)(PlaceForm)
