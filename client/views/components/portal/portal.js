import React, { Component } from 'react'
import portal from 'react-portal-hoc'

class Portal extends Component {
  render() {
    const {children, ...options} = this.props
    const Content = portal(options)(children)

    return <Content/>
  }
}

export default Portal
