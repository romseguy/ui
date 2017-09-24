import React from 'react'
import { translate } from 'react-i18next'
import { compose, pure } from 'recompose'
import styled from 'styled-components'

import sizeTypes from 'lib/maps/sizeTypes'

import { routerActions } from 'core/router'

import { FooterLink, FooterGrid } from 'components/footer'
import Icon from 'components/icon'
import { NoPadCol as Col } from 'components/layout'


const Parrot = styled(Icon)`
 display: inline-block !important;
 `


function FooterContainer({t}) {
// todo resize handler
  const isMobile = window.currentBreakpoint === sizeTypes.MOBILE

  return (
    <FooterGrid>
      <Col
        textAlign={isMobile ? 'left': 'right'}
      >
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
    </FooterGrid>
  )
}

export default compose(
  translate(),
  pure
)(FooterContainer)
