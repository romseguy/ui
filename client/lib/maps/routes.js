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

import MeContainer from 'containers/me'
import PlaceContainer from 'containers/place'
import PlacesContainer from 'containers/places'
import UserContainer from 'containers/user'

import { CanvasManager } from 'components/canvas'
import { MapManager } from 'components/map'


export default {
  [NOT_FOUND]: {
    path: '/not-found',
    saga: notFoundSaga
  },

  [routerActions.ROOT]: {
    container: PlacesContainer,
    control: MapManager,
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

  [routerActions.PLACE_VIEW]: {
    allowedSymbolTypes: [
      symbolTypes.PARROT
    ],
    container: PlaceContainer,
    control: CanvasManager,
    path: '/place/:placeTitle',
    saga: placeViewSaga
  },
  [routerActions.PLACE_SYMBOLS_ADD]: {
    allowedSymbolTypes: [
      symbolTypes.PARROT
    ],
    container: PlaceContainer,
    control: CanvasManager,
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
    container: UserContainer,
    control: CanvasManager,
    path: '/user/:username',
    saga: userViewSaga
  },

  [routerActions.ME]: {
    container: MeContainer,
    control: CanvasManager,
    path: '/me',
    saga: meSaga
  },

  [routerActions.ME_PLACES_ADD]: {
    container: MeContainer,
    control: CanvasManager,
    path: '/me/places/add',
    saga: mePlacesAddSaga
  },
  [routerActions.ME_PLACE_EDIT]: {
    container: MeContainer,
    control: CanvasManager,
    path: '/me/place/:placeTitle/edit',
    saga: mePlaceEditSaga
  },

  [routerActions.ME_SYMBOLS_ADD]: {
    container: MeContainer,
    control: CanvasManager,
    allowedSymbolTypes: [],
    path: '/me/symbols/:name/add',
    saga: meSymbolsAddSaga
  },
  [routerActions.ME_SYMBOL_VIEW]: {
    path: '/me/symbol/:name',
  },
  [routerActions.ME_SYMBOL_EDIT]: {
    container: MeContainer,
    control: CanvasManager,
    path: '/me/symbol/:name/edit',
  },

  [routerActions.ME_USERS_ADD]: {
    container: MeContainer,
    control: CanvasManager,
    path: '/me/users/add',
  },
  [routerActions.ME_USER_VIEW]: {
    path: '/me/user/:name',
  },
  [routerActions.ME_USER_EDIT]: {
    container: MeContainer,
    control: CanvasManager,
    path: '/me/user/:name/edit',
  }
}
