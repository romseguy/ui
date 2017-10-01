import routes from 'core/router/routes'


export default function isLocationAction(action) {
  return !!routes[action.type]
}
