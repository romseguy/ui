export const modalActions = {
  SET_MODAL: 'SET_MODAL',

  setModal: (modalType, modalProps) => ({
    type: modalActions.SET_MODAL,
    payload: {
      modalType,
      modalProps
    }
  })

}
