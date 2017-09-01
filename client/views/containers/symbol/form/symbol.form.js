import { compose } from 'ramda'
import React from 'react'
import { graphql } from 'react-apollo'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { change } from 'redux-form'
import { withHandlers } from 'recompose'
import { merge } from 'ramda'

import { roleTypes } from 'core/constants'
import { getTitle, getUserLocation } from 'core/settings'
import { routerActions, getPayload, getRouteType } from 'core/router'
import { getMeCentre } from 'core/me'

import { meQuery } from 'views/containers/me'
import { Container } from 'views/components/layout'
import SymbolForm, { SymbolFormHeader } from 'views/components/symbolForm'

//import symbolFormQuery from './symbol.form.query.graphql'
//import createSymbolMutation from './createSymbol.mutation.graphql'
//import createUserSymbolMutation from './createUserSymbol.mutation.graphql'


const handlers = {
  onSubmit: props => formValues => {
    const {todo /* todo */} = formValues

    const symbol = {
      //todo
    }
    props.doCreateSymbol({symbol})
  },
  onSuggestSelect: props => suggest => {
    const {short_name: city} = suggest.gmaps.address_components.find(address_component => {
      return address_component.types.includes('locality')
    })

    const {short_name: department} = suggest.gmaps.address_components.find(address_component => {
      return address_component.types.includes('administrative_area_level_2')
    })

    props.change('SymbolForm', 'city', city)
    props.change('SymbolForm', 'department', department)
  }
}

function SymbolFormContainer(props) {
  const {
    // state
    centre,
    formValues,
    initialValues,
    userLocation,
    disconnectedSymbols,
    routeType,
    title,
    // options
    isLoading,
    mustCreate,
    // actions
    t,
    onSubmit,
    onSuggestSelect
  } = props

  return (
    <Container fluid>
      <SymbolFormHeader
        routeType={routeType}
        routeTypes={routerActions}
        t={t}
        title={title}
      />
      <SymbolForm
        formValues={formValues}
        initialValues={initialValues}
        isLoading={isLoading}
        userLocation={userLocation}
        mustCreate={mustCreate}
        disconnectedSymbols={disconnectedSymbols}
        routeType={routeType}
        routeTypes={routerActions}
        t={t}
        onSubmit={onSubmit}
        onSuggestSelect={onSuggestSelect}
      />
    </Container>
  )
}


const mapStateToProps = state => {
  const routeType = getRouteType(state)
  const {name: symbolName} = getPayload(state)
  const centre = getMeCentre(state)
  const userLocation = getUserLocation(state)
  const title = getTitle(state)

  return {
    centre,
    formValues: state.form.SymbolForm ? state.form.SymbolForm.values : {},
    userLocation,
    symbolName,
    routeType,
    title
  }
}

const mapDispatchToProps = {
  change,
  meRoute: routerActions.meRoute
}

const symbolFormQueryConfig = {
  options: (props) => {
    return {
      variables: {
        title: props.symbolName || ''
      }
    }
  },
  props({data}) {
    const {mySymbols, symbol, symbols, loading} = data

    let initialValues = {}

    if (symbol) {
      initialValues = merge(initialValues, {
        city: symbol.city,
        marker: [symbol.latitude, symbol.longitude],
        title: symbol.title
      })
    }

    let props = {
      initialValues,
      isLoading: loading,
      mustCreate: !symbols || !symbols.length,
    }

    if (symbols) {
      props = merge(props, {
        disconnectedSymbols: mySymbols ? symbols.filter(symbol => {
          return !mySymbols.find(userSymbol => userSymbol.symbol.id === symbol.id)
        }) : symbols
      })
    }

    return props
  }
}

const createSymbolMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doCreateSymbol({symbol}){
        return mutate({
          variables: {
            symbol
          },
          refetchQueries: [{
            query: meQuery
          }]
        })
      }
    }
  }
}

const createUserSymbolMutationConfig = {
  props({ownProps, mutate}) {
    return {
      doCreateUserSymbol({symbolId, roleId}){
        return mutate({
          variables: {
            symbolId: Number(symbolId)
          },
          refetchQueries: [{
            query: meQuery
          }]
        })
      }
    }
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  /*graphql(symbolFormQuery, symbolFormQueryConfig),
  graphql(createSymbolMutation, createSymbolMutationConfig),
  graphql(createUserSymbolMutation, createUserSymbolMutationConfig),*/
  withHandlers(handlers),
  translate()
)(SymbolFormContainer)
