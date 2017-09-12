import { BINARY_COLOR_BLUE_30, BINARY_COLOR_BLUE_50 } from 'binary-ui-styles'
import React from 'react'
import Link from 'redux-first-router-link'
import styled from 'styled-components'


export default styled(Link)`
text-decoration: underline;
cursor: pointer;
color: ${BINARY_COLOR_BLUE_30};
margin-right: 5px;

:hover {
  color: ${BINARY_COLOR_BLUE_50}
}
`
