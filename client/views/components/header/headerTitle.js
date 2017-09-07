import React from 'react'
import styled from 'styled-components'

import { Segment as UISegment } from 'views/components/layout'


const Segment = styled(UISegment)`
padding: 0 !important;
margin: 0 !important;

::after {
  margin-top: -0.85em !important;
  width: 1.5em !important;
  height: 1.5em !important;
}
`

const Link = styled.a`
text-decoration: underline;
cursor: pointer;
color: blue;
`

const titleMaxLength = 100


function HeaderTitle({children, iconTitle, isLoading, title, titleIcon, onClick, onIconClick}) {

  if (typeof children === 'string' && children.length > titleMaxLength) {
    children = `${children.substring(0, titleMaxLength)}...`
  }

  return (
    <Segment basic loading={isLoading}>
      <Link
        title={iconTitle}
        onClick={onIconClick}
      >
        {titleIcon}
      </Link>
      <Link
        title={title}
        onClick={onClick}
      >
        {children}
      </Link>
    </Segment>
  )
}

export default HeaderTitle
