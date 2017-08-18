import { ApolloClient } from 'react-apollo'
import { createApolloFetch } from 'apollo-fetch'
import { print } from 'graphql/language/printer'

import authMiddleware from './auth.middleware'
import errorAfterware from './error.afterware'

const uri = process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4000/graphql'

const apolloFetch = createApolloFetch({uri})
  .use(authMiddleware)
//.useAfter(errorAfterware)

const networkInterface = {
  query: (req) => apolloFetch({...req, query: print(req.query)}).catch(e => e)
}

export default new ApolloClient({
/*  dataIdFromObject: object => {
    const {__typename, id} = object

    if (!id || __typename === 'Session') return

    return `${__typename}.${id}`
  },*/
  networkInterface
})
