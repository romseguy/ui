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

  NOT_FOUND: 'NOT_FOUND',

  notFoundRoute: () => ({
    type: routerActions.NOT_FOUND
  }),

  authRoute: () => ({
    type: routerActions.AUTH
  }),
  
  rootRoute: (centre) => ({
    type: routerActions.ROOT,
    payload: {
      centre
    }
  }),
  placesAddRoute: (centre) => ({
    type: routerActions.PLACES_ADD,
    payload: {
      centre
    }
  }),
  placeViewRoute: (name, centre) => ({
    type: routerActions.PLACE_VIEW,
    payload: {
      name,
      centre
    }
  }),
  placeEditRoute: (name, centre) => ({
    type: routerActions.PLACE_EDIT,
    payload: {
      name,
      centre
    }
  }),
 
  meRoute: (params) => ({
    type: routerActions.ME,
    payload: params
  }),
  
  mePlacesAddRoute: (centre) => ({
    type: routerActions.ME_PLACES_ADD,
    payload: {
      centre
    }
  }),
  mePlaceViewRoute: (name) => ({
    type: routerActions.ME_PLACE_VIEW,
    payload: {
      name
    }
  }),
  mePlaceEditRoute: (name, centre) => ({
    type: routerActions.ME_PLACE_EDIT,
    payload: {
      name,
      centre
    }
  }),
  
  meSymbolsAddRoute: (name, centre) => ({
    type: routerActions.ME_SYMBOLS_ADD,
    payload: {
      name,
      centre
    }
  }),
  meSymbolViewRoute: (name, centre) => ({
    type: routerActions.ME_SYMBOL_VIEW,
    payload: {
      name,
      centre
    }
  }),
  meSymbolEditRoute: (name, centre) => ({
    type: routerActions.ME_SYMBOL_EDIT,
    payload: {
      name,
      centre
    }
  }),

  meUsersAddRoute: (name, centre) => ({
    type: routerActions.ME_USERS_ADD,
    payload: {
      name,
      centre
    }
  }),
  meUserViewRoute: (name, centre) => ({
    type: routerActions.ME_USER_VIEW,
    payload: {
      name,
      centre
    }
  }),
  meUserEditRoute: (name, centre) => ({
    type: routerActions.ME_USER_EDIT,
    payload: {
      name,
      centre
    }
  })
}
