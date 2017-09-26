import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { compose, pure } from 'recompose'

import { routerActions } from 'core/router'

import SymbolForm from 'components/symbolForm'

import placeQuery from 'graphql/queries/place.query.graphql'


class SymbolFormDataContainer extends Component {
  state = {
    isScriptLoading: false
  }

  componentWillReceiveProps(nextProps) {
    const {
      currentRoute,
      isLoading,
      place,
      routePayload,
      routes,
      routeType
    } = nextProps

    if (!isLoading) {
      if ([routerActions.PLACE_SYMBOLS_ADD, routerActions.PLACE_SYMBOL_EDIT].includes(routeType)) {
        if (!place) {
          routes.notFoundRoute()
        } else if (!currentRoute.allowedSymbolTypes.includes(routePayload.symbolType.toUpperCase())) {
          routes.notFoundRoute()
        }
      }
    }
  }

  setIsScriptLoading = (isScriptLoading) => {
    this.setState(p => ({isScriptLoading}))
  }

  render() {
    const {
      isLoading,
      routePayload,
      ...props
    } = this.props

    const {
      ...state
    } = this.state

    let prefix

    if (!isLoading) {
      prefix = `form:symbol.${routePayload.symbolType.toLowerCase()}`
    }

    return (
      <SymbolForm
        {...props}
        {...state}
        isLoading={isLoading}
        prefix={prefix}
        setIsScriptLoading={this.setIsScriptLoading}
      />
    )
  }
}

const placeQueryConfig = {
  skip: props => {
    if (!props.routePayload.placeTitle) {
      return true
    }

    return false
  },
  options: (props) => {
    return {
      variables: {
        title: props.routePayload.placeTitle || ''
      }
    }
  },
  props({data, ownProps}) {
    const {
      place,
      loading
    } = data

    const {
      isLoading = false,
    } = ownProps

    const props = {
      isLoading: isLoading || loading,
      place: null
    }

    if (!loading && place) {
      props.place = place
    }

    return props
  }
}

export default compose(
  graphql(placeQuery, placeQueryConfig),
  pure
)(SymbolFormDataContainer)
