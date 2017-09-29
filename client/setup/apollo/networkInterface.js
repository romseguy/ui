import { createApolloFetch } from 'apollo-fetch'
import { print } from 'graphql/language/printer'

import debug from 'helpers/debug'
import getLang from 'helpers/getLang'

import { authMiddleware } from './auth'
import { errorAfterware } from './error'


const uri = `${process.env.REACT_APP_GRAPHQL_URL}?locale=${getLang()}`

const apolloFetch = createApolloFetch({uri})
  .use(authMiddleware)
//.useAfter(errorAfterware)

export default {
  query: (req) => {
    if (window.offlineMode) {
      return
    }

    return apolloFetch({...req, query: print(req.query)}).catch(error => {
      if (error.name === 'TypeError') {
        if (error.message === 'Failed to fetch') {
          debug('GraphQL server is offline')
          window.offlineMode = true
        }
      }
    })
  }
}
