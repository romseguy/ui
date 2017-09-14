import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose, getContext, pure, withProps } from 'recompose'

import { query } from 'helpers/apollo'

import { getCurrentUser } from 'core/me'

import Footer from 'containers/footer'
import Header from 'containers/header'
import Helmet from 'containers/helmet'
import Modals from 'containers/modal'
import Router from 'containers/router'

import { Layout } from 'components/layout'

import currentUserQuery from 'graphql/queries/currentUser.query.graphql'


class App extends Component {
  render() {
    const {
      currentUser
    } = this.props

    return (
      <div>
        <Helmet/>

        <Layout
          header={
            <Header
              currentUser={currentUser}
            />
          }
          footer={
            <Footer/>
          }
        >
          <Router currentUser={currentUser}/>
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

export default compose(
  connect(mapStateToProps),
  getContext({client: PropTypes.object}),
  pure
)(App)
