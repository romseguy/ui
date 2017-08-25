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
