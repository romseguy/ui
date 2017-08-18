import {
  addNode,
  deleteSelectedNode,
  deselectAllNodes,
  deselectNode,
  hoverNode,
  moveNode,
  selectNode,
  toggleNode
} from 'views/utils/nodes'

export default {
  onAnchorClick: props => (id) => {
    props.onNodeAnchorClick && props.onNodeAnchorClick(id)
  },

  onAnchorMouseOver: props => (id) => {
    const {nodes, onNodesChange} = props
    hoverNode(nodes, onNodesChange)(id, true)
  },

  onAnchorMouseOut: props => (id) => {
    const {nodes, onNodesChange} = props
    hoverNode(nodes, onNodesChange)(id, false)
  },

  onHeaderClick: props => (id) => {
    props.onNodeHeaderClick && props.onNodeHeaderClick(id)
  },

  onMapClick: props => ({event, latLng, pixel}) => {
    deselectAllNodes(props.nodes, props.onNodesChange)()
    props.onMapClick && props.onMapClick(event)
  }
}
