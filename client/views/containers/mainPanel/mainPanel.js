import { compose } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'utils/redux'
import { actions as tooltipActions } from 'redux-tooltip'

import { getIsAuthed } from 'core/auth'
import { mainPanelActions } from 'core/mainPanel'
import { routerActions, getRouteType } from 'core/router'

import Me from 'views/containers/me'
import Place from 'views/containers/place'
import Places from 'views/containers/places'

import { Container, Row } from 'views/components/layout'


class MainPanel extends Component {

  static getDimensions() {
    const {innerHeight, innerWidth} = window
    let mapHeight = innerHeight - 47
    let canvasHeight = innerHeight - 112
    let canvasWidth = innerWidth - 30

    if (innerWidth < 767) {
      mapHeight = innerHeight - 109
      canvasHeight = innerHeight - 260
      canvasWidth = innerWidth
    }

    return {
      canvasWidth,
      canvasHeight,
      mapWidth: innerWidth,
      mapHeight
    }
  }

  state = {
    ...MainPanel.getDimensions(),
  }

  componentDidMount() {
    window.addEventListener('resize', event => {
      this.setState(MainPanel.getDimensions())
    })
  }

  render() {
    const {
      hideTooltip,
      isAuthed,
      routeType,
      routes,
      setNodes,
      userLocation,
      onMapClick,
    } = this.props

    const {
      canvasHeight,
      canvasWidth,
      mapHeight,
      mapWidth
    } = this.state

    // depending on the route, we select a data container for the corresponding manager
    return (
      <Container fluid>
        {[
          routerActions.ROOT,
          routerActions.PLACES_ADD,
          routerActions.PLACE_EDIT
        ].includes(routeType) && (
          <Places
            mapHeight={mapHeight}
            mapWidth={mapWidth}
            userLocation={userLocation}
            onNodesChange={setNodes}
          />
        )}

        {[
          routerActions.PLACE_VIEW,
          routerActions.ME_PLACE_VIEW
        ].includes(routeType) && (
          <Place
            canvasHeight={canvasHeight}
            canvasWidth={canvasWidth}
            hideTooltip={hideTooltip}
            isAuthed={isAuthed}
            routes={routes}
            onNodesChange={setNodes}
          />
        )}

        {[
          routerActions.ME,
          routerActions.ME_PLACES_ADD,
          routerActions.ME_PLACE_EDIT
        ].includes(routeType) && (
          <Me
            canvasHeight={canvasHeight}
            canvasWidth={canvasWidth}
            hideTooltip={hideTooltip}
            isAuthed={isAuthed}
            routes={routes}
            onNodesChange={setNodes}
          />
        )}
      </Container>
    )
  }
}

//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = state => {
  const isAuthed = getIsAuthed(state)
  const routeType = getRouteType(state)

  return {
    isAuthed,
    routeType
  }
}

const mapDispatchToProps = dispatch => {
  return {
    routes: bindActionCreators(routerActions, dispatch),
    ...bindActionCreators({
      closeSidePanel: mainPanelActions.closeSidePanel,
      showTooltip: tooltipActions.show,
      hideTooltip: tooltipActions.hide,
      setNodes: mainPanelActions.setNodes
    }, dispatch)
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MainPanel)
