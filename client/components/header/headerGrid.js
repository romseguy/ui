import React from 'react'
import styled from 'styled-components'

import { Grid } from 'components/layout'
import media from 'helpers/media'


export default styled(Grid)`
${media.COMPUTER`box-shadow: 0px -1px 10px black;`}
${media.MOBILE`box-shadow: none;`}
padding: 5px !important;
`
