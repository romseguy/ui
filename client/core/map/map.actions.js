export const mapActions = {
  REFETCH_PLACES: 'REFETCH_PLACES',
  SET_MAP_CENTER: 'SET_MAP_CENTER',
  SET_NODES: 'SET_NODES',
  SET_NODES_LOADING: 'SET_NODES_LOADING',

  setCenter: center => ({
    type: mapActions.SET_MAP_CENTER,
    payload: {center}
  }),

  setNodes: nodes => ({
    type: mapActions.SET_NODES,
    payload: {nodes}
  }),

  setNodesLoading: loading => ({
    type: mapActions.SET_NODES_LOADING,
    payload: {loading}
  })
}
