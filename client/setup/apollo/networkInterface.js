import { createApolloFetch } from 'apollo-fetch'
import { print } from 'graphql/language/printer'

import { authMiddleware } from './auth'
import { errorAfterware } from './error'


const uri = process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4000/graphql'

const apolloFetch = createApolloFetch({uri})
  .use(authMiddleware)
//.useAfter(errorAfterware)

export default {
  query: (req) => apolloFetch({...req, query: print(req.query)}).catch(e => e)
}
