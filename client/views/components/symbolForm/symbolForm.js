import { compose } from 'ramda'
import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'
import { reduxForm } from 'redux-form'

import { Form as UIForm, Loader } from 'views/components/layout'

import SymbolFormFields from './symbolFormFields'


class SymbolForm extends Component {
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
      formValues,
      userLocation,
      mustCreate,
      disconnectedSymbols,
      routeType,
      routeTypes,
      t,
      handleSubmit,
      onSuggestSelect
    } = this.props
    const {action} = formValues

    if (this.state.isLoading || this.props.isLoading) {
      return <Loader active inline="centered"/>
    }

    let readOnly = false
    let showSelector = false

    switch (routeType) {
      case routeTypes.ME_SYMBOLS_ADD:
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
            <SymbolFormSelector
              disconnectedSymbols={disconnectedSymbols}
              formValues={formValues}
              t={t}
            />
          </UIForm>
        )}

        <UIForm
          loading={false}
          onSubmit={handleSubmit}
        >
          <SymbolFormFields
            userLocation={userLocation}
            formValues={formValues}
            readOnly={readOnly}
            showSelector={showSelector}
            t={t}
            onSuggestSelect={onSuggestSelect}
          />
        </UIForm>
      </div>
    )
  }
}

export default compose(
  scriptLoader('https://maps.googleapis.com/maps/api/js?key=AIzaSyCZbB5gENry_UJNvwtOStrRqTt7sTi0E9k&libraries=symbols'),
  reduxForm({
    form: 'SymbolForm',
    enableReinitialize: true
  })
)(SymbolForm)
