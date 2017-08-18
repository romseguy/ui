import React from 'react'
import Icon, { IconLink } from '../icon'


function ToolbarIcon(props) {
  const {
    active,
    disabled,
    id,
    margin,
    name,
    title,
    onClick
  } = props

  return (
    <IconLink
      active={active}
      disabled={disabled}
      onClick={disabled ? () => {} : onClick}
      title={title}
    >
      <Icon
        id={id}
        name={name}
        margin={margin}
      />
    </IconLink>
  )
}

export default ToolbarIcon

