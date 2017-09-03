import { compose } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import Router from 'views/containers/router'
import Header from 'views/containers/header'
import Helmet from 'views/containers/helmet'
import Modals from 'views/containers/modal'

import { Layout } from 'views/components/layout'

import currentUserQuery from './currentUser.query.graphql'


class App extends Component {

  handleTitleIconClick = event => {
    this.forceUpdate()
  }

  render() {
    const {currentUserQuery: {currentUser}} = this.props

    return (
      <div>
        <Helmet appTitle="Paix Roquet"/>

        <Layout
          header={
            <Header
              currentUser={currentUser}
              onTitleIconClick={this.handleTitleIconClick}
            />
          }>
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