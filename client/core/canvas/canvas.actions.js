export const canvasActions = {
  // ACTIONS
  SELECT_NODE: 'SELECT_NODE',
  SELECT_NODES: 'SELECT_NODES',
  SET_NODES: 'SET_NODES',
  SET_NODE: 'SET_NODE',
  ADD_NODE: 'ADD_NODE',
  UNSELECT_NODE: 'UNSELECT_NODE',
  UNSELECT_NODES: 'UNSELECT_NODES',
  UPDATE_NODE: 'UPDATE_NODE',
  REMOVE_NODE: 'REMOVE_NODE',

  addNode: (node) => ({
    type: canvasActions.ADD_NODE,
    payload: {node}
  }),

  removeNode: (key) => ({
    type: canvasActions.REMOVE_NODE,
    payload: {key}
  }),

  selectNode: (selectedNodeId) => ({
    type: canvasActions.SELECT_NODE,
    payload: {selectedNodeIds: [selectedNodeId]}
  }),

  selectNodes: (selectedNodeIds) => ({
    type: canvasActions.SELECT_NODES,
    payload: {selectedNodeIds}
  }),

  setNode: (node) => ({
    type: canvasActions.SET_NODE,
    payload: {node}
  }),

  setNodes: (nodes) => ({
    type: canvasActions.SET_NODES,
    payload: {nodes}
  }),

  unselectNode: (unselectedNodeId) => ({
    type: canvasActions.UNSELECT_NODE,
    payload: {unselectedNodeIds: [unselectedNodeId]}
  }),
  unselectNodes: (unselectedNodeIds) => ({
    type: canvasActions.UNSELECT_NODES,
    payload: {unselectedNodeIds}
  }),

  updateNode: (id, attrs) => ({
    type: canvasActions.UPDATE_NODE,
    payload: {attrs, id}
  }),

  // SAGA EVENTS
  // UI EVENTS

}
