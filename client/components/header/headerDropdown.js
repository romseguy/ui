import { BINARY_COLOR_BLUE_30, BINARY_COLOR_BLUE_50 } from 'binary-ui-styles'
import React from 'react'
import styled from 'styled-components'
import { Dropdown } from 'components/layout'


export default styled(Dropdown)`
color: ${BINARY_COLOR_BLUE_30};

:hover {
  color: ${BINARY_COLOR_BLUE_50}
}
`
