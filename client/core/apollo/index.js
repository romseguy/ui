import client from './apollo.client'

export { apolloSaga } from './apollo.saga'

export { client }
export const apolloMiddleware = client.middleware()
export const apolloReducer = client.reducer()
