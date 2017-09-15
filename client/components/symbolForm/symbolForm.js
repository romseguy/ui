import React, { Component } from 'react'
import { compose, pure } from 'recompose'
import { reduxForm } from 'redux-form'

import { Form as UIForm, Loader } from 'components/layout'

import SymbolFormFields from './symbolFormFields'


class SymbolForm extends Component {
  render() {
    const {
      formValues,
      userLocation,
      t,
      handleSubmit,
      onSuggestSelect
    } = this.props

    if (this.props.isLoading) {
      return <Loader active inline="centered"/>
    }

    let readOnly = false

    return (
      <UIForm
        loading={false}
        onSubmit={handleSubmit}
      >
        <SymbolFormFields
          formValues={formValues}
          readOnly={readOnly}
          t={t}
          userLocation={userLocation}
          onSuggestSelect={onSuggestSelect}
        />
      </UIForm>
    )
  }
}

export default compose(
  reduxForm({
    form: 'SymbolForm',
    enableReinitialize: true
  }),
  pure
)(SymbolForm)
