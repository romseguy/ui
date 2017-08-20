import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'

import { isSidePanelOpen } from 'core/mainPanel'
import { routerActions, getRouteType } from 'core/router'
import routes from 'core/routes'

import Portal from 'views/components/portal'
import SidePanel from 'views/components/sidePanel'


function Portals({isSidePanelOpen, routeType}) {
  const {sidePanelComponent} = routes[routeType]

  return (
    <Portal isOpen={isSidePanelOpen}>
      {() => (
        <SidePanel>
          {[
            routerActions.ME_PLACES_ADD, routerActions.ME_PLACE_EDIT, routerActions.ME_PLACE_VIEW,
            routerActions.PLACES_ADD, routerActions.PLACE_EDIT, routerActions.PLACE_VIEW
          ].includes(routeType) && React.createElement(sidePanelComponent)}

          {[
            routerActions.ME_USERS_ADD, routerActions.ME_USER_EDIT, routerActions.ME_USER_VIEW
          ].includes(routeType) && React.createElement(sidePanelComponent)}
        </SidePanel>
      )}
    </Portal>
  )
}


//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = state => ({
  isSidePanelOpen: isSidePanelOpen(state),
  routeType: getRouteType(state)
})

const mapDispatchToProps = {}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
)(Portals)
