export const canvasActions = {
  ADD_NODE: 'ADD_NODE',
  HOVER_NODE: 'HOVER_NODE',
  SELECT_ALL_NODES: 'SELECT_ALL_NODES',
  SELECT_NODE: 'SELECT_NODE',
  SELECT_NODES: 'SELECT_NODES',
  SET_CANVAS_NODES: 'SET_CANVAS_NODES',
  SET_CANVAS_NODES_LOADING: 'SET_CANVAS_NODES_LOADING',
  UNSELECT_NODES: 'UNSELECT_NODES',
  REMOVE_NODE: 'REMOVE_NODE',

  addNode: (node) => ({
    type: canvasActions.ADD_NODE,
    payload: {node}
  }),

  hoverNode: (hovered, node) => ({
    type: canvasActions.HOVER_NODE,
    payload: {
      hovered,
      node
    }
  }),

  removeNode: (node) => ({
    type: canvasActions.REMOVE_NODE,
    payload: {node}
  }),

  selectAllNodes: (selected) => ({
    type: canvasActions.SELECT_ALL_NODES,
    payload: {
      selected
    }
  }),
  selectNode: (selected, node) => ({
    type: canvasActions.SELECT_NODE,
    payload: {
      node,
      selected
    }
  }),
  selectNodes: (selectedNodeIds) => ({
    type: canvasActions.SELECT_NODES,
    payload: {selectedNodeIds}
  }),

  setNodes: (nodes) => ({
    type: canvasActions.SET_CANVAS_NODES,
    payload: {nodes}
  }),

  setNodesLoading: loading => ({
    type: canvasActions.SET_CANVAS_NODES_LOADING,
    payload: {loading}
  }),

  unselectNodes: (unselectedNodeIds) => ({
    type: canvasActions.UNSELECT_NODES,
    payload: {unselectedNodeIds}
  })
}
