import { pipe } from 'ramda'
import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { getTitle } from 'core/settings'


function HelmetContainer({title}) {
  return (
    <Helmet>
      <meta charSet="utf-8"/>
      <link rel="canonical" href="http://mysite.com/example"/>

      <title>{title}</title>
    </Helmet>
  )
}


const mapStateToProps = (state, {appTitle}) => {
  const title = getTitle(state)

  return {
    title: `${appTitle} | ${title || 'Chargement...'}`
  }
}

const mapDispatchToProps = {}

export default pipe(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
)(HelmetContainer)
