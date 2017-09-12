import { compose } from 'ramda'
import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { routerActions, getRouteType } from 'core/router'

import symbolTypes from 'lib/maps/symbolTypes'
import { toolboxSymbols } from 'lib/factories'

import SymbolsToolbox from 'components/symbolsToolbox'


function SymbolsToolboxContainer(props) {
  return (
    <SymbolsToolbox {...props}/>
  )
}


const mapStateToProps = (state, {t}) => {
  const symbols = [toolboxSymbols[symbolTypes.NOTIFICATION]({t})]

  return {
    symbols
  }
}

const mapDispatchToProps = {}

export default compose(
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SymbolsToolboxContainer)
