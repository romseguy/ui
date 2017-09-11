import React from 'react'
import { withHandlers } from 'recompose'
import styled from 'styled-components'

import Icon, { IconLink } from 'components/icon'
import { Button } from 'components/layout'


export function ToolboxButton({active, disabled, label, title, onClick}) {
  return (
    <Button
      active={active}
      disabled={disabled}
      title={title}
      toggle
      onClick={onClick}
    >
      {label} &nbsp;
      <Icon
        id={active ? 'chevron-bottom' : 'chevron-top'}
        size={0.6}
        weight='heavy'
      />
    </Button>
  )
}

export const ToolboxMenu = styled.ul`
list-style-type: none;
padding: 0;
margin: 0;
`


const handlers = {
  onCloseClick: ({onClose}) => e => {
    e.preventDefault()
    typeof onClose === 'function' && onClose()
  }
}

function Toolbox({children, className, onCloseClick}) {
  return (
    <div className={className}>
      {onCloseClick && (
        <IconLink
          className="close-toolbox"
          onClick={onCloseClick}
        >
          <Icon id="close"/>
        </IconLink>
      )}

      {children}
    </div>
  )
}

export default withHandlers(handlers)(Toolbox)
