import getCurrentUserSaga from './getCurrentUser.saga'
import setDepartmentTitleSaga from './setDepartmentTitle.saga'
import setTitleSaga from './setTitle.saga'
import toggleModalSaga from './toggleModal.saga'
import watchQuerySaga from './watchQuery.saga'

import toggleAuthModalSaga from './modals/toggleAuthModal.saga'
import toggleDeleteNodeConfirmSaga from './modals/toggleDeleteNodeConfirm.saga'
import toggleErrorModalSaga from './modals/toggleErrorModal.saga'

export {
  getCurrentUserSaga,
  setDepartmentTitleSaga,
  setTitleSaga,
  toggleAuthModalSaga,
  toggleDeleteNodeConfirmSaga,
  toggleErrorModalSaga,
  toggleModalSaga,
  watchQuerySaga
}
