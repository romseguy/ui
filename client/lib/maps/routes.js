import React from 'react'
import { NOT_FOUND } from 'redux-first-router'

import symbolTypes from 'lib/maps/symbolTypes'

import {
  notFoundSaga,
  rootSaga,
  aboutSaga,
  authSaga,
  logoutSaga,
  // auth required
  meSaga,
  mePlacesAddSaga,
  mePlaceEditSaga,
  meSymbolsAddSaga,
  placeSymbolsAddSaga,
  placeSymbolEditSaga,
  placeViewSaga,
  userViewSaga,
} from 'lib/sagas/routes'

import { routerActions } from 'core/router'


export default {
  [NOT_FOUND]: {
    path: '/not-found',
    saga: notFoundSaga
  },

  [routerActions.ROOT]: {
    path: '/',
    saga: rootSaga,
    requiresAuth: false
  },

  [routerActions.ABOUT]: {
    path: '/about',
    saga: aboutSaga,
    requiresAuth: false
  },

  [routerActions.TUTORIAL]: {
    path: '/tutorial',
    requiresAuth: false
  },

  [routerActions.AUTH]: {
    path: '/auth',
    saga: authSaga,
    requiresAuth: false
  },

  [routerActions.LOGOUT]: {
    path: '/logout',
    saga: logoutSaga,
    requiresAuth: false
  },

  [routerActions.PLACES_ADD]: {
    path: '/places/add'
  },
  [routerActions.PLACE_VIEW]: {
    path: '/place/:placeTitle',
    saga: placeViewSaga
  },
  [routerActions.PLACE_EDIT]: {
    path: '/place/:name/edit'
  },
  [routerActions.PLACE_SYMBOLS_ADD]: {
    allowedSymbolTypes: [
      symbolTypes.PARROT
    ],
    path: '/place/:placeTitle/symbols/add/:symbolType',
    saga: placeSymbolsAddSaga
  },
  [routerActions.PLACE_SYMBOL_EDIT]: {
    allowedSymbolTypes: [
      symbolTypes.PARROT
    ],
    path: '/place/:placeTitle/symbols/add/:symbolType',
    saga: placeSymbolEditSaga
  },

  [routerActions.USER_VIEW]: {
    path: '/user/:name',
    saga: userViewSaga
  },

  [routerActions.ME]: {
    path: '/me',
    saga: meSaga
  },

  [routerActions.ME_PLACES_ADD]: {
    path: '/me/places/add',
    saga: mePlacesAddSaga
  },
  [routerActions.ME_PLACE_VIEW]: {
    path: '/me/place/:placeTitle',
  },
  [routerActions.ME_PLACE_EDIT]: {
    path: '/me/place/:placeTitle/edit',
    saga: mePlaceEditSaga
  },

  [routerActions.ME_SYMBOLS_ADD]: {
    allowedSymbolTypes: [],
    path: '/me/symbols/:name/add',
    saga: meSymbolsAddSaga
  },
  [routerActions.ME_SYMBOL_VIEW]: {
    path: '/me/symbol/:name',
  },
  [routerActions.ME_SYMBOL_EDIT]: {
    path: '/me/symbol/:name/edit',
  },

  [routerActions.ME_USERS_ADD]: {
    path: '/me/users/add',
  },
  [routerActions.ME_USER_VIEW]: {
    path: '/me/user/:name',
  },
  [routerActions.ME_USER_EDIT]: {
    path: '/me/user/:name/edit',
  }
}
