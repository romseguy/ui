create the modal component in `containers.modal.modals`

dispatch a SET_MODAL action created with `core.modal.actions.setModal` action creator passing in:
 - the modal component identifier from `core.modal.constants`
 - props that will be passed into the modal component
 - props that will be passed into the modal wrapper from https://react.semantic-ui.com/modules/modal or https://react.semantic-ui.com/addons/confirm
