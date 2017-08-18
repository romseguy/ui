import { routerActions } from 'core/router'
import { centres } from 'core/constants'

import { PlaceForm } from 'views/containers/places'
//import { UserForm } from 'views/containers/users'
import { SymbolForm } from 'views/containers/symbols'

export default {
  [routerActions.NOT_FOUND]: {
    path: '/notFound'
  },

  [routerActions.AUTH]: {
    path: '/auth',
    isModal: true,
    modalRoute: routerActions.ROOT
  },

  [routerActions.ROOT]: {
    path: '/',
    centre: centres.DEPARTMENT,
  },
  [routerActions.PLACES_ADD]: {
    path: '/places/add',
    centre: centres.DEPARTMENT,
    requiresAuth: true,
    sidePanelComponent: PlaceForm
  },
  [routerActions.PLACE_VIEW]: {
    path: '/place/:name',
    centre: centres.LOCATION,
  },
  [routerActions.PLACE_EDIT]: {
    path: '/place/:name/edit',
    centre: centres.DEPARTMENT,
    requiresAuth: true,
    sidePanelComponent: PlaceForm
  },

  [routerActions.ME]: {
    path: '/me',
    centre: centres.MONAD,
    requiresAuth: true
  },
  [routerActions.ME_SYMBOLS_ADD]: {
    path: '/me/symbols/add',
    centre: centres.MONAD,
    requiresAuth: true,
    sidePanelComponent: SymbolForm
  },
  [routerActions.ME_SYMBOL_VIEW]: {
    path: '/me/symbol/:name',
    centre: centres.LOCATION,
    requiresAuth: true
  },
  [routerActions.ME_PLACES_ADD]: {
    path: '/me/places/add',
    centre: centres.MONAD,
    requiresAuth: true,
    sidePanelComponent: PlaceForm
  },
  [routerActions.ME_PLACE_VIEW]: {
    path: '/me/place/:name',
    centre: centres.LOCATION,
    requiresAuth: true
  },
  [routerActions.ME_PLACE_EDIT]: {
    path: '/me/place/:name/edit',
    centre: centres.MONAD,
    requiresAuth: true,
    sidePanelComponent: PlaceForm
  },
  [routerActions.ME_USERS_ADD]: {
    path: '/me/users/add',
    centre: centres.MONAD,
    requiresAuth: true,
    //sidePanelComponent: UserForm
  },
  [routerActions.ME_USER_VIEW]: {
    path: '/me/user/:name',
    centre: centres.LOCATION,
    requiresAuth: true
  },
  [routerActions.ME_USER_EDIT]: {
    path: '/me/user/:name/edit',
    centre: centres.MONAD,
    requiresAuth: true,
    //sidePanelComponent: UserForm
  }
}
