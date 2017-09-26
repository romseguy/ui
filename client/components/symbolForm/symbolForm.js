import React from 'react'
import { compose, pure, withHandlers } from 'recompose'
import { reduxForm } from 'redux-form'

import { Form as UIForm } from 'components/layout'

import SymbolFormFields from './symbolFormFields'
import SymbolFormHeader from './symbolFormHeader'
import SymbolFormLayout from './symbolFormLayout'


const handlers = {
  onSaveClick: props => event => {
    const {
      onSubmit,
      handleSubmit
    } = props

    handleSubmit(event, values => onSubmit(values))
  }
}

function SymbolForm(props) {
  const {
    isLoading,
    isScriptLoading,
    serverErrors,
    ...rest
  } = props

  const hasServerErrors = Array.isArray(serverErrors) && serverErrors.length > 0

  return (
    <SymbolFormLayout fluid>
      <SymbolFormHeader
        {...rest}
      />

      <UIForm
        error={hasServerErrors}
        loading={isLoading || isScriptLoading}
      >
        <SymbolFormFields
          {...rest}
          readOnly={false}
        />
      </UIForm>
    </SymbolFormLayout>
  )
}

export default compose(
  reduxForm({
    form: 'SymbolForm',
    enableReinitialize: true
  }),
  withHandlers(handlers),
  pure
)(SymbolForm)
