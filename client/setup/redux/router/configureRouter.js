import createHistory from 'history/createBrowserHistory'
import { connectRoutes } from 'redux-first-router'


function configureRouter(routes) {
  const history = createHistory()

  return connectRoutes(history, routes, {initialDispatch: false})
}

export default configureRouter
