import { pipe } from 'ramda'
import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { getTitle } from 'core/settings'

function AppHelmet({appTitle, title}) {
  return (
    <Helmet>
      <meta charSet="utf-8"/>
      <link rel="canonical" href="http://mysite.com/example"/>

      <title>{`${appTitle} | ${title || ''}`}</title>
    </Helmet>
  )
}


const mapStateToProps = state => {
  return {
    title: getTitle(state)
  }
}

const mapDispatchToProps = {}

export default pipe(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
)(AppHelmet)
