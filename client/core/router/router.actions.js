export const routerActions = {
  AUTH: 'AUTH',

  ROOT: 'ROOT',

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

  authRoute: () => ({
    type: routerActions.AUTH
  }),
  
  rootRoute: (payload) => ({
    type: routerActions.ROOT,
    payload
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
 
  meRoute: (params) => ({
    type: routerActions.ME,
    payload: params
  }),
  
  mePlacesAddRoute: () => ({
    type: routerActions.ME_PLACES_ADD,
    payload: {
    }
  }),
  mePlaceViewRoute: (name) => ({
    type: routerActions.ME_PLACE_VIEW,
    payload: {
      name
    }
  }),
  mePlaceEditRoute: (name) => ({
    type: routerActions.ME_PLACE_EDIT,
    payload: {
      name
    }
  }),
  
  meSymbolsAddRoute: () => ({
    type: routerActions.ME_SYMBOLS_ADD,
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
