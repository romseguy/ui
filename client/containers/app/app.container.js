import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose, getContext, pure } from 'recompose'

import bindActionCreators from 'helpers/bindActionCreators'

import { getCurrentUser } from 'core/me'
import { routerActions } from 'core/router'

import Footer from 'containers/footer'
import Header from 'containers/header'
import Helmet from 'containers/helmet'
import Modals from 'containers/modal'
import Router from 'containers/router'

import { Layout } from 'components/layout'


class App extends Component {
  render() {
    const {
      ...props
    } = this.props

    return (
      <div>
        <Helmet/>

        <Layout
          header={
            <Header {...props}/>
          }
          footer={
            <Footer/>
          }
        >
          <Router {...props}/>
        </Layout>

        <Modals/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUser: getCurrentUser(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    routes: bindActionCreators(routerActions, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  getContext({client: PropTypes.object}),
  pure
)(App)
