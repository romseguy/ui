import React from 'react'

import Icon from 'components/icon'
import { Button } from 'components/layout'


export default function ToolboxButton({active, disabled, iconName, label, title, onClick}) {
  return (
    <Button
      active={active}
      disabled={disabled}
      title={title}
      toggle
      onClick={onClick}
      style={{cursor: onClick ? 'pointer' : 'default'}}
    >
      {iconName && (
        <Icon
          name={iconName}
        />
      )}
      {label} &nbsp;
      <Icon
        id={active ? 'chevron-bottom' : 'chevron-top'}
        size={0.6}
        weight='heavy'
      />
    </Button>
  )
}
