import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { compose, pure } from 'recompose'

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


const currentUserQueryConfig = {
  fetchPolicy: 'network-only',
  props({data, ownProps}) {
    const {currentUser, loading} = data
    const props = {
      currentUser
    }

    return props
  }
}

export default compose(
  graphql(currentUserQuery, currentUserQueryConfig),
  pure
)(App)
