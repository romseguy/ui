import { BINARY_COLOR_BLUE_30, BINARY_COLOR_BLUE_50 } from 'binary-ui-styles'
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

const Version = styled.span`
border-bottom: 1px dashed ${BINARY_COLOR_BLUE_30};
cursor: help;

:hover {
border-color: ${BINARY_COLOR_BLUE_50};
}
`


function FooterContainer({t}) {
// todo resize handler
  const isMobile = window.currentBreakpoint === sizeTypes.MOBILE

  return (
    <FooterGrid>
      <Col tablet={13}>
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
      <Col
        tablet={3}
        textAlign={isMobile ? 'left': 'right'}
      >
        {t('app_title')} <Version title={t('version')}>v1.0-alpha</Version>
      </Col>
    </FooterGrid>
  )
}

export default compose(
  translate(),
  pure
)(FooterContainer)
