import { pipe } from 'ramda'
import React from 'react'
import { Helmet } from 'react-helmet'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { getTitle } from 'core/settings'


function HelmetContainer({t, title}) {
  return (
    <Helmet>
      <meta charSet="utf-8"/>
      <link rel="canonical" href="http://mysite.com/example"/>

      <title>{t('app_title')} {title ? `| ${title}` : ''}</title>
    </Helmet>
  )
}


const mapStateToProps = (state) => {
  const title = getTitle(state)

  return {
    title
  }
}

const mapDispatchToProps = {}

export default pipe(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  translate()
)(HelmetContainer)
