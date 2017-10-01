import { BINARY_COLOR_BLUE_30, BINARY_COLOR_BLUE_50 } from 'binary-ui-styles'
import React from 'react'
import Link from 'redux-first-router-link'
import styled from 'styled-components'


const template = `
text-decoration: underline;
cursor: pointer;
color: ${BINARY_COLOR_BLUE_30};

:hover {
  color: ${BINARY_COLOR_BLUE_50}
}
`

export const HeaderLinkRaw = styled.a`${template}`
export default styled(Link)`${template}`
