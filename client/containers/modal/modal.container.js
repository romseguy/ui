import 'assets/scss/modal.scss'

import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'

import { modalActions, modalConstants, getModals } from 'core/modal'

import AuthFormContainer from 'containers/authForm'
import { Button, Container, Header, Icon, Modal } from 'components/layout'
import SetLocationForm from 'components/setLocationForm'


const withModal = (modalProps, modalComponentProps) => {
  return function(ModalComponent) {
    if (!modalProps.open) {
      return null
    }

    return (
      <ModalComponent
        modalProps={modalProps}
        {...modalComponentProps}
      />
    )
  }
}

const modalComponents = {
  [modalConstants.AUTH]: function AuthModal({modalProps}) {
    return (
      <Modal {...modalProps}>
        <AuthFormContainer/>
      </Modal>
    )
  },
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

function ModalContainer({modals, t, setModal}) {
  const modalTypes = Object.keys(modals)

  if (!modalTypes.length) {
    return null
  }

  const closeIcon = (
    <div style={{position: 'absolute', top: -15, right: 0}}>
      <Icon name="close" fitted style={{cursor: 'pointer', color: 'white'}}/>
    </div>
  )

  return (
    <div>
      {modalTypes.map(modalType => {
        const modalComponent = modalComponents[modalType]
        let {modalProps, ...modalComponentProps} = modals[modalType]

        modalProps = {
          closeIcon,
          onClose: () => setModal(modalType, {isOpen: false}),
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
  setModal: modalActions.setModal
}

export default compose(
  translate(),
  connect(mapStateToProps, mapDispatchToProps),
  pure
)(ModalContainer)
