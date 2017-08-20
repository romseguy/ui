import { routerActions } from 'core/router'
import { centreTypes } from 'core/constants'

import { PlaceForm } from 'views/containers/places'
import { UserForm } from 'views/containers/users'
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
    centre: centreTypes.DEPARTMENT,
  },

  [routerActions.PLACES_ADD]: {
    path: '/places/add',
    centre: centreTypes.DEPARTMENT,
    requiresAuth: true,
    sidePanelComponent: PlaceForm
  },
  [routerActions.PLACE_VIEW]: {
    path: '/place/:name',
    centre: centreTypes.LOCATION,
  },
  [routerActions.PLACE_EDIT]: {
    path: '/place/:name/edit',
    centre: centreTypes.DEPARTMENT,
    requiresAuth: true,
    sidePanelComponent: PlaceForm
  },

  [routerActions.ME]: {
    path: '/me',
    centre: centreTypes.PERSON,
    requiresAuth: true
  },

  [routerActions.ME_PLACES_ADD]: {
    path: '/me/places/add',
    centre: centreTypes.PERSON,
    requiresAuth: true,
    sidePanelComponent: PlaceForm
  },
  [routerActions.ME_PLACE_VIEW]: {
    path: '/me/place/:name',
    centre: centreTypes.LOCATION,
    requiresAuth: true
  },
  [routerActions.ME_PLACE_EDIT]: {
    path: '/me/place/:name/edit',
    centre: centreTypes.PERSON,
    requiresAuth: true,
    sidePanelComponent: PlaceForm
  },

  [routerActions.ME_SYMBOLS_ADD]: {
    path: '/me/symbols/add',
    centre: centreTypes.PERSON,
    requiresAuth: true,
    sidePanelComponent: SymbolForm
  },
  [routerActions.ME_SYMBOL_VIEW]: {
    path: '/me/symbol/:name',
    centre: centreTypes.LOCATION,
    requiresAuth: true
  },
  [routerActions.ME_SYMBOL_EDIT]: {
    path: '/me/symbol/:name/edit',
    centre: centreTypes.PERSON,
    requiresAuth: true,
    sidePanelComponent: PlaceForm
  },

  [routerActions.ME_USERS_ADD]: {
    path: '/me/users/add',
    centre: centreTypes.PERSON,
    requiresAuth: true,
    sidePanelComponent: UserForm
  },
  [routerActions.ME_USER_VIEW]: {
    path: '/me/user/:name',
    centre: centreTypes.LOCATION,
    requiresAuth: true
  },
  [routerActions.ME_USER_EDIT]: {
    path: '/me/user/:name/edit',
    centre: centreTypes.PERSON,
    requiresAuth: true,
    //sidePanelComponent: UserForm
  }
}
