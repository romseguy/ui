import { Grid as UIGrid } from 'semantic-ui-react'
import styled from 'styled-components'

const Grid = styled(UIGrid)`
margin: 0 !important;
padding: 0 !important;
`

export { Grid }

export const Row = UIGrid.Row

export const Col = UIGrid.Column

export const NoPadCol = styled(Col) `
padding: 0 !important;
`

export const NoPadRow = styled(Row) `
padding: 0 !important;
`
