import React from 'react'
import styled from 'styled-components'

import { Grid } from 'views/components/layout'
import { media } from 'views/utils/responsive'


export default styled(Grid)`
${media.desktop`box-shadow: 0px -1px 10px black;`}
${media.tablet`box-shadow: none;`}
`
