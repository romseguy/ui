import React from 'react'
import styled from 'styled-components'

import { Segment } from 'views/components/layout'


const HeaderTitleContainer = styled(Segment)`
padding: 0 !important;
margin: 0 !important;

::after {
  margin-top: -0.85em !important;
  width: 1.5em !important;
  height: 1.5em !important;
}
`

const HeaderTitleLink = styled.a`
text-decoration: underline;
cursor: pointer;
color: blue;
margin-left: 5px;
margin-right: 5px;
`

function HeaderTitle({children, isLoading, onClick}) {
  return (
    <HeaderTitleContainer basic loading={isLoading}>
      <HeaderTitleLink onClick={onClick}>
        {children}
      </HeaderTitleLink>
    </HeaderTitleContainer>
  )
}

export default HeaderTitle
