import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'

import { isSidePanelOpen } from 'core/mainPanel'

import { PlaceForm } from 'views/containers/places'

import Portal from 'views/components/portal'
import SidePanel from 'views/components/sidePanel'


function Portals({isSidePanelOpen}) {
  return (
    <Portal isOpen={isSidePanelOpen}>
      {() => (
        <SidePanel>
          <PlaceForm/>
        </SidePanel>
      )}
    </Portal>
  )
}


//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = state => ({
  isSidePanelOpen: isSidePanelOpen(state),
})

const mapDispatchToProps = {}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
)(Portals)
