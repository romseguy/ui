export const mainPanelActions = {
  // ACTIONS
  SET_MAIN_PANEL_SELECTED_NODE_ID: 'SET_MAIN_PANEL_SELECTED_NODE_ID',
  SET_MAIN_PANEL_NODES: 'SET_MAIN_PANEL_NODES',
  SET_MAIN_PANEL_NODE: 'SET_MAIN_PANEL_NODE',
  ADD_MAIN_PANEL_NODE: 'ADD_MAIN_PANEL_NODE',
  UPDATE_MAIN_PANEL_NODE: 'UPDATE_MAIN_PANEL_NODE',
  REMOVE_MAIN_PANEL_NODE: 'REMOVE_MAIN_PANEL_NODE',
  OPEN_MAIN_PANEL_SIDE_PANEL: 'OPEN_MAIN_PANEL_SIDE_PANEL',
  CLOSE_MAIN_PANEL_SIDE_PANEL: 'CLOSE_MAIN_PANEL_SIDE_PANEL',

  setSelectedNodeId: (selectedNodeId) => ({
    type: mainPanelActions.SET_MAIN_PANEL_SELECTED_NODE_ID,
    payload: {selectedNodeId}
  }),

  setNodes: (nodes) => ({
    type: mainPanelActions.SET_MAIN_PANEL_NODES,
    payload: {nodes}
  }),

  setNode: (node) => ({
    type: mainPanelActions.SET_MAIN_PANEL_NODE,
    payload: {node}
  }),

  addNode: (node) => ({
    type: mainPanelActions.ADD_MAIN_PANEL_NODE,
    payload: {node}
  }),

  updateNode: (id, attrs) => ({
    type: mainPanelActions.UPDATE_MAIN_PANEL_NODE,
    payload: {attrs, id}
  }),

  removeNode: (key) => ({
    type: mainPanelActions.REMOVE_MAIN_PANEL_NODE,
    payload: {key}
  }),

  openSidePanel: () => ({
    type: mainPanelActions.OPEN_MAIN_PANEL_SIDE_PANEL
  }),
  
  closeSidePanel: () => ({
    type: mainPanelActions.CLOSE_MAIN_PANEL_SIDE_PANEL
  })

  // SAGA EVENTS
  // UI EVENTS

}
