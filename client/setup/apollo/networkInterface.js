import { createApolloFetch } from 'apollo-fetch'
import { print } from 'graphql/language/printer'

import { authMiddleware } from './auth'
import { errorAfterware } from './error'

let offlineMode = false

const uri = process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4000/graphql'

const apolloFetch = createApolloFetch({uri})
  .use(authMiddleware)
//.useAfter(errorAfterware)

export default {
  query: (req) => {
    if (offlineMode) {
      return
    }

    return apolloFetch({...req, query: print(req.query)}).catch(error => {
      if (error.name === 'TypeError') {
        if (error.message === 'Failed to fetch') {
          console.debug('we are offline')
          window.offlineMode = true
          offlineMode = true
        }
      }
    })
  }
}
