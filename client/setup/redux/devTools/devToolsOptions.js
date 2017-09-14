export default {
  actionsBlacklist: [
    'rrf/blur',
    'rrf/focus',
    'rrf/clearIntents',
    'rrf/setValidity'
  ],
  predicate: (state, {type}) => {
    if (typeof type.startsWith === 'function') {
      if (type.startsWith('@@redux-form')) return true

      if (type.startsWith('redux-tooltip') || type.startsWith('@@redux-form')) {
        return false
      }
    }

    return false
  }
}
