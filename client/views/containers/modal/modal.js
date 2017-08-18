import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'

import { modalActions, modalConstants, getModals } from 'core/modal'

import { AuthForm } from 'views/containers/auth'
import { Button, Container, Header, Icon, Modal } from 'views/components/layout'


const withModal = (modalProps, modalComponentProps) => {
  return function(ModalComponent) {
    return modalProps.open && (
        <ModalComponent
          modalProps={modalProps}
          {...modalComponentProps}
        />
      )
  }
}

const modalComponents = {
  [modalConstants.AUTH]: ({modalProps}) => (
    <Modal {...modalProps}>
      <AuthForm/>
    </Modal>
  ),
  [modalConstants.ERROR]: ({modalProps, errors = [], title}) => (
    <Modal {...modalProps}>
      <Header icon="warning sign" content={title}/>
      <Modal.Content>
        <ul>
          {errors.map((error, id) => <li key={`error-${id}`}>{error.message || error}</li>)}
        </ul>
      </Modal.Content>
      <Modal.Actions>
        <Button inverted onClick={modalProps.onClose}>
          <Icon name="checkmark"/> OK
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

function ModalContainer({modals, onClose}) {
  const modalTypes = Object.keys(modals)

  if (!modalTypes.length) {
    return null
  }

  const closeIcon = (
    <Container textAlign="right">
      <Icon name="close" fitted style={{cursor: 'pointer'}} />
    </Container>
  )

  return (
    <div>
      {modalTypes.map(modalType => {
        const modalComponent = modalComponents[modalType]
        const {modalProps, ...modalComponentProps} = modals[modalType]

        return withModal({
          closeIcon,
          onClose: () => onClose(modalType, {isOpen: false}),
          open: modalComponentProps.isOpen,
          ...modalProps
        }, {
          key: `modal-${modalType}`,
          ...modalComponentProps
        })(modalComponent)
      })}
    </div>
  )
}

//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = state => ({
  modals: getModals(state)
})

const mapDispatchToProps = {
  onClose: modalActions.setModal
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
)(ModalContainer)
