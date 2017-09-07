import 'views/assets/scss/modal.scss'

import { compose } from 'ramda'
import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { modalActions, modalConstants, getModals } from 'core/modal'

import { AuthForm } from 'views/containers/auth'
import { Button, Container, Header, Icon, Modal } from 'views/components/layout'
import SetLocationForm from 'views/components/setLocationForm'


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
  [modalConstants.AUTH]: ({modalProps, t}) => (
    <Modal {...modalProps}>
      <AuthForm t={t}/>
    </Modal>
  ),
  [modalConstants.ERROR]: ({modalProps, errors = [], title}) => (
    <Modal {...modalProps}>
      <Header>
        <Icon name="warning sign"/>
        {title}
      </Header>
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
  ),
  [modalConstants.SET_LOCATION]: ({modalProps, center, t, title, onSubmit, onSuggestSelect}) => {
    const handleSubmit = values => onSubmit(values, modalProps.onClose)

    return (
      <Modal {...modalProps}>
        <Header
          icon="world"
          content={title}
        />
        <SetLocationForm
          center={center}
          t={t}
          onSubmit={handleSubmit}
          onSuggestSelect={onSuggestSelect}
        />
      </Modal>
    )
  }
}

function ModalContainer({modals, t, onClose}) {
  const modalTypes = Object.keys(modals)

  if (!modalTypes.length) {
    return null
  }

  const closeIcon = (
    <Container textAlign="right">
      <Icon name="close" fitted style={{cursor: 'pointer'}}/>
    </Container>
  )

  return (
    <div>
      {modalTypes.map(modalType => {
        const modalComponent = modalComponents[modalType]
        let {modalProps, ...modalComponentProps} = modals[modalType]

        modalProps = {
          closeIcon,
          onClose: () => onClose(modalType, {isOpen: false}),
          open: modalComponentProps.isOpen,
          ...modalProps
        }

        modalComponentProps = {
          key: `modal-${modalType}`,
          t,
          ...modalComponentProps
        }

        return withModal(modalProps, modalComponentProps)(modalComponent)
      })}
    </div>
  )
}


const mapStateToProps = state => ({
  modals: getModals(state)
})

const mapDispatchToProps = {
  onClose: modalActions.setModal
}

export default compose(
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
)(ModalContainer)
