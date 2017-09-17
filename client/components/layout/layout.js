import React from 'react'
import { Grid as UIGrid } from 'semantic-ui-react'
import styled from 'styled-components'


export const Col = UIGrid.Column

export const Grid = styled(UIGrid)`
margin: 0 !important;
padding: 0 !important;
`

export function Layout({children, footer, header}) {
  return (
    <div>
      <header>
        {header}
      </header>
      <main>
        {children}
      </main>
      <footer>
        {footer}
      </footer>
    </div>
  )
}

export const NoPadCol = styled(Col) `
padding: 0 !important;
`

export const NoPadRow = styled(UIGrid.Row)`
padding: 0 !important;
`

export const Row = UIGrid.Row
