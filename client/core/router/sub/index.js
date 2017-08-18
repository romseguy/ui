import { routerActions } from '../'
import { authSaga } from './router.auth.saga'

import {
  rootSaga,
  placesAddSaga,
  placeViewSaga,
  placeEditSaga,
  notFoundSaga,
} from './router.root.saga'

import {
  meSaga,
  mePlacesAddSaga,
  mePlaceViewSaga,
  mePlaceEditSaga
} from './router.me.saga'

export default {
  [routerActions.NOT_FOUND]: notFoundSaga,
  [routerActions.AUTH]: authSaga,
  
  [routerActions.ROOT]: rootSaga,
  [routerActions.PLACES_ADD]: placesAddSaga,
  [routerActions.PLACE_VIEW]: placeViewSaga,
  [routerActions.PLACE_EDIT]: placeEditSaga,
  
  [routerActions.ME]: meSaga,
  [routerActions.ME_PLACES_ADD]: mePlacesAddSaga,
  [routerActions.ME_PLACE_VIEW]: mePlaceViewSaga,
  [routerActions.ME_PLACE_EDIT]: mePlaceEditSaga
}
