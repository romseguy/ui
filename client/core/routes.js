import React from 'react'

import {
  rootSaga,
  aboutSaga,
  authSaga,
  logoutSaga,
  placeViewSaga,
  userViewSaga,
  notFoundSaga,
  meSaga,
  mePlacesAddSaga,
  mePlaceEditSaga,
} from 'lib/sagas/routes'

import { routerActions } from 'core/router'

export default {
  [routerActions.NOT_FOUND]: {
    path: '/notFound',
    saga: notFoundSaga
  },

  [routerActions.ROOT]: {
    path: '/',
    saga: rootSaga
  },

  [routerActions.ABOUT]: {
    path: '/about',
    saga: aboutSaga
  },

  [routerActions.TUTORIAL]: {
    path: '/tutorial'
  },

  [routerActions.AUTH]: {
    path: '/auth',
    modalRouteType: routerActions.ROOT,
    saga: authSaga
  },

  [routerActions.LOGOUT]: {
    path: '/logout',
    saga: logoutSaga
  },

  [routerActions.PLACES_ADD]: {
    path: '/places/add',
    requiresAuth: true
  },
  [routerActions.PLACE_VIEW]: {
    path: '/place/:name',
    saga: placeViewSaga
  },
  [routerActions.PLACE_EDIT]: {
    path: '/place/:name/edit',
    requiresAuth: true
  },

  [routerActions.USER_VIEW]: {
    path: '/user/:name',
    requiresAuth: true,
    saga: userViewSaga
  },

  [routerActions.ME]: {
    path: '/me',
    requiresAuth: true,
    saga: meSaga
  },

  [routerActions.ME_PLACES_ADD]: {
    path: '/me/places/add',
    requiresAuth: true,
    saga: mePlacesAddSaga
  },
  [routerActions.ME_PLACE_VIEW]: {
    path: '/me/place/:name',
    requiresAuth: true
  },
  [routerActions.ME_PLACE_EDIT]: {
    path: '/me/place/:name/edit',
    requiresAuth: true,
    saga: mePlaceEditSaga
  },

  [routerActions.ME_SYMBOLS_ADD]: {
    path: '/me/symbols/add',
    requiresAuth: true
  },
  [routerActions.ME_SYMBOL_VIEW]: {
    path: '/me/symbol/:name',
    requiresAuth: true
  },
  [routerActions.ME_SYMBOL_EDIT]: {
    path: '/me/symbol/:name/edit',
    requiresAuth: true
  },

  [routerActions.ME_USERS_ADD]: {
    path: '/me/users/add',
    requiresAuth: true
  },
  [routerActions.ME_USER_VIEW]: {
    path: '/me/user/:name',
    requiresAuth: true
  },
  [routerActions.ME_USER_EDIT]: {
    path: '/me/user/:name/edit',
    requiresAuth: true
  }
}
