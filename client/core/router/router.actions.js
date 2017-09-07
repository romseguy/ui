export const routerActions = {
  ROOT: 'ROOT',

  ABOUT: 'ABOUT',
  AUTH: 'AUTH',
  LOGOUT: 'LOGOUT',

  PLACES_ADD: 'PLACES_ADD',
  PLACE_VIEW: 'PLACE_VIEW',
  PLACE_EDIT: 'PLACE_EDIT',

  ME: 'ME',
  
  ME_PLACES_ADD: 'ME_PLACES_ADD',
  ME_PLACE_VIEW: 'ME_PLACE_VIEW',
  ME_PLACE_EDIT: 'ME_PLACE_EDIT',

  ME_USERS_ADD: 'ME_USERS_ADD',
  ME_USER_VIEW: 'ME_USER_VIEW',
  ME_USER_EDIT: 'ME_USER_EDIT',

  ME_SYMBOLS_ADD: 'ME_SYMBOLS_ADD',
  ME_SYMBOL_VIEW: 'ME_SYMBOL_VIEW',
  ME_SYMBOL_EDIT: 'ME_SYMBOL_EDIT',
  
  USER_VIEW: 'USER_VIEW',

  NOT_FOUND: 'NOT_FOUND',

  notFoundRoute: () => ({
    type: routerActions.NOT_FOUND
  }),

  rootRoute: (payload) => ({
    type: routerActions.ROOT,
    payload
  }),

  aboutRoute: () => ({
    type: routerActions.ABOUT
  }),

  authRoute: () => ({
    type: routerActions.AUTH
  }),

  logoutRoute: () => ({
    type: routerActions.LOGOUT
  }),

  placesAddRoute: () => ({
    type: routerActions.PLACES_ADD,
    payload: {
    }
  }),
  placeViewRoute: (name) => ({
    type: routerActions.PLACE_VIEW,
    payload: {
      name
    }
  }),
  placeEditRoute: (name) => ({
    type: routerActions.PLACE_EDIT,
    payload: {
      name
    }
  }),
  
  userViewRoute: (name) => ({
    type: routerActions.USER_VIEW,
    payload: {
      name
    }
  }),
 
  meRoute: (payload) => ({
    type: routerActions.ME,
    payload
  }),
  
  mePlacesAddRoute: () => ({
    type: routerActions.ME_PLACES_ADD,
    payload: {
    }
  }),
  mePlaceViewRoute: (payload) => ({
    type: routerActions.ME_PLACE_VIEW,
    payload
  }),
  mePlaceEditRoute: (name) => ({
    type: routerActions.ME_PLACE_EDIT,
    payload: {
      name
    }
  }),
  
  meSymbolsAddRoute: (symbolType) => ({
    type: routerActions.ME_SYMBOLS_ADD,
    payload: {
      symbolType
    }
  }),
  meSymbolViewRoute: (name) => ({
    type: routerActions.ME_SYMBOL_VIEW,
    payload: {
      name
    }
  }),
  meSymbolEditRoute: (name) => ({
    type: routerActions.ME_SYMBOL_EDIT,
    payload: {
      name
    }
  }),

  meUsersAddRoute: () => ({
    type: routerActions.ME_USERS_ADD
  }),
  meUserViewRoute: (name) => ({
    type: routerActions.ME_USER_VIEW,
    payload: {
      name
    }
  }),
  meUserEditRoute: (name) => ({
    type: routerActions.ME_USER_EDIT,
    payload: {
      name
    }
  })
}
