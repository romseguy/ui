one directory per redux module (state branch)
a module contain 5 files at most:
- index file i.e the module API => the codebase never import module files directory
- actions file with action types and action creators
- reducer
- saga which can be composed of many sub-sagas either from sagas sub-directory (when file grows too big) or from core/shared/sagas when they're shared accross many modules
- selectors
