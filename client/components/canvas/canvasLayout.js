import styled from 'styled-components'
import { media } from 'utils/responsive'

export default styled.div`
${media.desktop`
margin-left: 15px;
margin-right: 15px;
`}
${media.tablet`
margin-left: 0;
margin-right: 0;
`}
`
