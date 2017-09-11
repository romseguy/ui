import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import Footer from 'containers/footer'
import Header from 'containers/header'
import Helmet from 'containers/helmet'
import Modals from 'containers/modal'
import Router from 'containers/router'

import { Layout } from 'components/layout'

import currentUserQuery from './currentUser.query.graphql'


class App extends Component {
  render() {
    const {currentUserQuery: {currentUser}} = this.props

    return (
      <div>
        <Helmet/>

        <Layout
          header={
            <Header
              currentUser={currentUser}
              forceUpdate={() => this.forceUpdate()}
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


const currentUserQueryConfig = {
  name: 'currentUserQuery',
  fetchPolicy: 'network-only'
}

export default compose(
  graphql(currentUserQuery, currentUserQueryConfig)
)(App)
