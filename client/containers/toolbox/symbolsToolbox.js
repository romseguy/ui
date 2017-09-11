import { compose } from 'ramda'
import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { routerActions, getRouteType } from 'core/router'

import { symbolTypes, toolboxSymbols } from 'utils/types/symbols'

import SymbolsToolbox from 'components/symbolsToolbox'


function SymbolsToolboxContainer(props) {
  return (
    <SymbolsToolbox {...props}/>
  )
}


const mapStateToProps = (state, {t}) => {
  const symbols = [toolboxSymbols[symbolTypes.SERVICE]({t})]

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
