import React from 'react'
import styled from 'styled-components'

import { Grid } from 'components/layout'
import media from 'lib/maps/media'


export default styled(Grid)`
${media.desktop`box-shadow: 0px -1px 10px black;`}
${media.tablet`box-shadow: none;`}
padding: 5px !important;
`
