import { compose } from 'ramda'
import React from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'

import { routerActions } from 'core/router'

import FooterLink from 'components/footer/footerLink'
import Icon from 'components/icon'
import { Grid, NoPadCol as Col } from 'components/layout'


const Parrot = styled(Icon)`
 display: inline-block !important;
 `


function FooterContainer({t}) {
  return (
    <Grid
      columns={2}
      stackable
      verticalAlign="middle"
    >
      <Col computer={14}>
        {t('app_title')}
        {' '}
        <Parrot
          height={14}
          name="parrot"
          width={14}
        />
        {' '}

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
