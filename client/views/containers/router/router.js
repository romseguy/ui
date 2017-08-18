import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'

import { getIsAuthed } from 'core/auth'
import { routerActions, getRouteType } from 'core/router'
import routes from 'core/routes'

import { Loader } from 'views/components/layout'
import MainPanel from 'views/containers/mainPanel'


function Router({currentRoute = {}, isAuthed, routeType}) {
  if (currentRoute.requiresAuth && routeType !== routerActions.AUTH && !isAuthed) {
    return <Loader indeterminate/>
  }

  const selectedRouteType = currentRoute.isModal ? currentRoute.modalRoute : routeType

  switch (selectedRouteType) {
    case routerActions.NOT_FOUND:
      return <span>404</span>
    default:
      return <MainPanel routeType={selectedRouteType}/>
  }
}


//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = state => {
  const routeType = getRouteType(state)

  return {
    currentRoute: routes[routeType],
    isAuthed: getIsAuthed(state),
    routeType
  }
}

const mapDispatchToProps = {}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
)(Router)
