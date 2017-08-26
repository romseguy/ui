import upd from 'immutability-helper'

import { getRandomArbitrary } from 'utils/number'

import { roleTypes } from 'core/constants'

import { atomTypes } from 'views/utils/atoms'
import { atoms } from 'views/assets/img'


const noop = () => {}

export const personToNode = (id, person) => {
  const {
    username,
    x,
    y
  }= person

  return {
    // identifiers
    id,
    idServer: Number(person.id),
    type: atomTypes.PERSON,

    // state
    name: username,

    //x: x ? parseFloat(x) : 10,
    //y: y ? parseFloat(y) : 10,
    x: getRandomArbitrary(50, 300),
    y: getRandomArbitrary(50, 300),


    // options
    height: 100,
    image: atoms.yellow,
    imageSelected: atoms.yellow_selected,
    imageHeight: 50,
    imageWidth: 50,
    titleYOffset: 50,
    width: 50
  }
}

export const placeToNode = (id, place, mine = false) => {
  const {
    distance,
    latitude,
    longitude,
    title: name,
    x,
    y,
  } = place

  return {
    // identifiers
    id,
    idServer: Number(place.id),
    type: atomTypes.LOCATION,

    // state
    distance,
    latitude,
    longitude,
    mine,
    name,
    selected: false,
    x: x ? parseFloat(x) : 10,
    y: y ? parseFloat(y) : 10,

    // options
    backgroundColor: 'transparent',
    height: 100,
    // images
    image: mine ? atoms.green : atoms.green,
    imageSelected: mine ? atoms.green_selected : atoms.green_selected,
    imageHeight: 50,
    imageWidth: 50,
    textColor: 'black',
    titleYOffset: 50,
    width: 50
  }
}

export const addNode = (nodes, callback = noop) => (node) => {
  const updated = nodes.concat([node])
  callback(updated)
}

export const deleteSelectedNode = (nodes, callback = noop) => () => {
  let n = null

  const updated = nodes.filter((node) => {
    if (node.selected) {
      n = node
    }
    return !node.selected
  })
  callback(updated)
  return n
}

export const deselectAllNodes = (nodes, callback = noop) => () => {
  let update = false
  const updated = nodes.map((node) => {
    if (node.selected) {
      update = true
    }
    return {...node, selected: false}
  })
  if (update) {
    callback(updated)
  }
  return updated
}

export const deselectNode = (nodes, callback = noop) => (id) => {
  toggleNode(nodes, callback = noop)(id, false)
}

export const hoverNode = (nodes, callback = noop) => (id, hovered) => {
  let update = true
  const updated = nodes.map(node => {
    if (id !== node.id) {
      return {...node, hovered: false}
    }

    if (node.hovered === hovered) {
      update = false
    }

    return {...node, hovered}
  })
  if (update) {
    callback(updated)
  }
}
export const moveNode = (nodes, callback = noop) => (id, x, y) => {
  const merged = upd(nodes[id], {$merge: {x: x, y: y}})
  const updated = upd(nodes, {$splice: [[id, 1, merged]]})
  callback(updated)
}

export const selectNode = (nodes, callback = noop) => (id) => {
  toggleNode(nodes, callback = noop)(id, true)
}


export const toggleNode = (nodes, callback = noop) => (id, bool) => {
  let update = true
  const updated = nodes.map(node => {
    if (id !== node.id) {
      return {...node, selected: false}
    }

    if (bool !== undefined) {
      if ((bool === true && node.selected) || (bool === false && !node.selected)) {
        update = false
        return node
      }
      return {...node, selected: bool}
    }

    return {...node, selected: !node.selected}
  })
  if (update) {
    callback(updated)
  }
}
