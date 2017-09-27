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
    hasServerErrors,
    isLoading,
    isScriptLoading,
    showFields,
    showSelectFields,
    showSelector,
    ...rest
  } = props


  return (
    <PlaceFormLayout fluid>
      <PlaceFormHeader
        {...rest}
      />

      <UIForm
        error={hasServerErrors}
        loading={isLoading || isScriptLoading}
      >
        {showSelector && (
          <PlaceFormSelector
            {...rest}
          />
        )}

        {showSelectFields && (
          <PlaceFormSelectFields
            {...rest}
            hasServerErrors={hasServerErrors}
          />
        )}

        {showFields && (
          <PlaceFormFields
            {...rest}
            hasServerErrors={hasServerErrors}
            isLoading={isLoading}
            isScriptLoading={isScriptLoading}
            readOnly={false}
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
