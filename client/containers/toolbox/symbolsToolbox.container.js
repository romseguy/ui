import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'

import { getRouteType } from 'core/router'

import routes from 'lib/maps/routes'
import { toolboxSymbols } from 'lib/factories'

import SymbolsToolbox from 'components/symbolsToolbox'


function SymbolsToolboxContainer(props) {
  return (
    <SymbolsToolbox {...props}/>
  )
}


const mapStateToProps = (state, {t}) => {
  const routeType = getRouteType(state)
  const {allowedSymbolTypes = []} = routes[routeType]
  const symbols = allowedSymbolTypes.map(symbolType => toolboxSymbols[symbolType]({t}))

  return {
    symbols
  }
}

const mapDispatchToProps = {}

export default compose(
  translate(),
  connect(mapStateToProps, mapDispatchToProps),
  pure
)(SymbolsToolboxContainer)
