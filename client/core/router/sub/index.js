import { routerActions } from '../'

import {
  authSaga,
  logoutSaga,
  rootSaga,
  placesAddSaga,
  placeViewSaga,
  placeEditSaga,
  userViewSaga,
  notFoundSaga,
} from './router.root.saga'

import {
  meSaga,
  mePlacesAddSaga,
  mePlaceViewSaga,
  mePlaceEditSaga,
  meUsersAddSaga
} from './router.me.saga'

export default {
  [routerActions.NOT_FOUND]: notFoundSaga,
  [routerActions.AUTH]: authSaga,
  [routerActions.LOGOUT]: logoutSaga,

  [routerActions.ROOT]: rootSaga,
  [routerActions.PLACES_ADD]: placesAddSaga,
  [routerActions.PLACE_VIEW]: placeViewSaga,
  [routerActions.PLACE_EDIT]: placeEditSaga,
  [routerActions.USER_VIEW]: userViewSaga,

  [routerActions.ME]: meSaga,
  [routerActions.ME_PLACES_ADD]: mePlacesAddSaga,
  [routerActions.ME_PLACE_VIEW]: mePlaceViewSaga,
  [routerActions.ME_PLACE_EDIT]: mePlaceEditSaga,
  [routerActions.ME_USERS_ADD]: meUsersAddSaga
}
