import { BINARY_COLOR_BLUE_30, BINARY_COLOR_BLUE_50 } from 'binary-ui-styles'
import styled from 'styled-components'
import Icon from 'components/icon'


export default styled(Icon)`
color: ${BINARY_COLOR_BLUE_30};

:hover {
  color: ${BINARY_COLOR_BLUE_50}
}
`
