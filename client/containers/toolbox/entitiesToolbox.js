import { compose } from 'ramda'
import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { routerActions, getRouteType } from 'core/router'

import { entityTypes, toolboxEntities } from 'utils/types/entities'

import EntitiesToolbox from 'components/entitiesToolbox'


function EntitiesToolboxContainer(props) {
  return (
    <EntitiesToolbox {...props}/>
  )
}

const mapStateToProps = (state, {t}) => {
  const routeType = getRouteType(state)

  const entities = [
    toolboxEntities[entityTypes.CITY]({t}),
    toolboxEntities[entityTypes.PLACE]({t})
  ]

  if ([routerActions.ME, routerActions.PLACE_VIEW].includes(routeType)) {
    entities.push(toolboxEntities[entityTypes.PERSON]({t}))
  }

  return {
    entities
  }
}

const mapDispatchToProps = {}

export default compose(
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EntitiesToolboxContainer)
