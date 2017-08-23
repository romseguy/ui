import { compose } from 'ramda'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { actions as tooltipActions } from 'redux-tooltip'

import { mainPanelActions } from 'core/mainPanel'


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
      mapHeight,
      mapWidth: innerWidth
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
      children,
      nodes,
      ...props
    } = this.props

    const {
      ...state
    } = this.state

    return React.cloneElement(children, {
      ...state,
      ...props,
      nodes
    })

    // depending on the route, we select a data container for the corresponding manager
    /*    return (
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
     routes={routes}
     onNodesChange={setNodes}
     >
     </Place>
     )}

     {[
     routerActions.ME,
     routerActions.ME_PLACES_ADD,
     routerActions.ME_PLACE_EDIT,
     routerActions.ME_USERS_ADD,
     routerActions.ME_USER_EDIT
     ].includes(routeType) && (
     <Me
     canvasHeight={canvasHeight}
     canvasWidth={canvasWidth}
     hideTooltip={hideTooltip}
     routes={routes}
     onNodesChange={setNodes}
     />
     )}
     </Container>
     )*/
  }
}


const mapStateToProps = state => ({})

const mapDispatchToProps = {
  closeSidePanel: mainPanelActions.closeSidePanel,
  showTooltip: tooltipActions.show,
  hideTooltip: tooltipActions.hide,
  onNodesChange: mainPanelActions.setNodes
}

export default compose(
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MainPanel)
