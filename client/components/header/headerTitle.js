import React from 'react'
import styled from 'styled-components'

import { Segment as UISegment } from 'components/layout'


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


function HeaderTitle(props) {
  const {
    children,
    connectIcon,
    connectIconTitle,
    entityIcon,
    entityIconTitle,
    title,
    locationIcon,
    locationIconTitle,
    onEntityIconClick,
    onLocationIconClick,
    onClick,
    onConnectIconClick
  } = props

  return (
    <div>
      {entityIcon && onEntityIconClick && (
        <Link
          title={entityIconTitle}
          onClick={onEntityIconClick}
        >
          {entityIcon}
        </Link>
      )}

      {entityIcon && !onEntityIconClick && (
        <span title={entityIconTitle}> {entityIcon}</span>
      )}

      {onClick && (
        <Link
          title={title}
          onClick={onClick}
        >
          {children}
        </Link>
      )}

      {!onClick && (
        <span title={title}>{children}</span>
      )}

      {' '}

      {locationIcon && onLocationIconClick && (
        <Link
          title={locationIconTitle}
          onClick={onLocationIconClick}
        >
          {locationIcon}
        </Link>
      )}

      {connectIcon && onConnectIconClick && (
        <Link
          title={connectIconTitle}
          onClick={onConnectIconClick}
        >
          {connectIcon}
        </Link>
      )}
    </div>
  )
}

export default HeaderTitle
