import React from 'react'

import { HeaderLinkRaw, HeaderLink } from './'


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
        <HeaderLinkRaw
          title={entityIconTitle}
          onClick={onEntityIconClick}
          style={{borderBottom: '1px dashed black', cursor: 'help', padding: '2px'}}
        >
          {entityIcon}
        </HeaderLinkRaw>
      )}

      {entityIcon && !onEntityIconClick && (
        <span
          style={{borderBottom: '1px dashed black', cursor: 'help', padding: '2px'}}
          title={entityIconTitle}
        >
          {entityIcon}
          </span>
      )}

      {onClick && (
        <HeaderLinkRaw
          title={title}
          onClick={onClick}
        >
          {children}
        </HeaderLinkRaw>
      )}

      {!onClick && (
        <span title={title}>{children}</span>
      )}

      {' '}

      {locationIcon && onLocationIconClick && (
        <HeaderLinkRaw
          title={locationIconTitle}
          onClick={onLocationIconClick}
        >
          {locationIcon}
        </HeaderLinkRaw>
      )}

      {connectIcon && onConnectIconClick && (
        <HeaderLinkRaw
          title={connectIconTitle}
          onClick={onConnectIconClick}
        >
          {connectIcon}
        </HeaderLinkRaw>
      )}
    </div>
  )
}

export default HeaderTitle
