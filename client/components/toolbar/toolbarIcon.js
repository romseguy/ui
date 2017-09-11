import React from 'react'
import Icon, { IconLink } from '../icon'


const noop = () => {}

function ToolbarIcon(props) {
  const {
    active,
    disabled,
    id,
    margin,
    name,
    style,
    text,
    title,
    onClick
  } = props

  return (
    <IconLink
      active={active}
      disabled={disabled}
      onClick={disabled ? noop : onClick}
      style={{
        fontSize: text ? '1.5rem' : '1rem',
        ...style
      }}
      title={title}
    >
      {text ? text : (
        <Icon
          id={id}
          name={name}
          margin={margin}
        />
      )}
    </IconLink>
  )
}

export default ToolbarIcon

