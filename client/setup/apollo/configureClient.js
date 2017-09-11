import { ApolloClient } from 'react-apollo'
import networkInterface from './networkInterface'


function configureClient() {
  return new ApolloClient({
    /*  dataIdFromObject: object => {
     const {__typename, id} = object

     if (!id || __typename === 'Session') return

     return `${__typename}.${id}`
     },*/
    networkInterface
  })
}

export default configureClient
