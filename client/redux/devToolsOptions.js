export const devToolsOptipns = {
  actionsBlacklist: [
    'rrf/blur',
    'rrf/focus',
    'rrf/clearIntents',
    'rrf/setValidity'
  ],
  predicate: (state, {type}) => {
    if (typeof type.startsWith === 'function') {
      if (type.startsWith('redux-tooltip') || type.startsWith('@@redux-form')) {
        return false
      }

      return true
    }
  }
}
