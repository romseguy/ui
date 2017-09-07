import { compose } from 'ramda'
import React from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'

import { routerActions } from 'core/router'

import FooterLink from 'views/components/footer/footerLink'
import Icon from 'views/components/icon'
import { Grid, NoPadCol as Col } from 'views/components/layout'


/*const Parrot = styled(Icon)`
 display: inline-block !important;
 `
 <Parrot
 height={14}
 name="parrot"
 width={14}
 />*/


function FooterContainer({t}) {
  return (
    <Grid
      columns={2}
      stackable
      verticalAlign="middle"
    >
      <Col computer={14}>
        {/* <Icon name="flag outline" />{t('app_title')}{' '}<Icon name="leaf"/> */}
        {t('app_title')} | {' '}

        <FooterLink to={routerActions.aboutRoute()}>
          {t('about')}
        </FooterLink>
      </Col>

      <Col computer={2} style={{textAlign: 'right'}}>
        <Icon name="flag outline"/>+{' '}<Icon name="leaf"/>={' '}<Icon name="heart"/>
      </Col>
    </Grid>
  )
}

export default compose(
  translate()
)(FooterContainer)
