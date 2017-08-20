import upd from 'immutability-helper'

import { getRandomArbitrary } from 'utils/number'

import { atomTypes } from 'views/utils/atoms'
import { atoms } from 'views/assets/img'


export const personToNode = (id, person) => {
  const {
    username
  }= person

  return {
    // identifiers
    id,
    idServer: Number(person.id),
    type: atomTypes.PERSON,

    // state
    name: username,
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
    image: atoms.green,
    imageSelected: atoms.green_selected,
    imageHeight: 50,
    imageWidth: 50,
    textColor: mine ? 'blue' : 'black',
    titleYOffset: 50,
    width: 50
  }
}

export const addNode = (nodes, callback) => (node) => {
  const updated = nodes.concat([node])
  callback(updated)
}

export const deleteSelectedNode = (nodes, callback) => () => {
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

export const deselectAllNodes = (nodes, callback) => () => {
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
}

export const deselectNode = (nodes, callback) => (id) => {
  toggleNode(nodes, callback)(id, false)
}

export const hoverNode = (nodes, callback) => (id, hovered) => {
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
export const moveNode = (nodes, callback) => (id, x, y) => {
  const merged = upd(nodes[id], {$merge: {x: x, y: y}})
  const updated = upd(nodes, {$splice: [[id, 1, merged]]})
  callback(updated)
}

export const selectNode = (nodes, callback) => (id) => {
  toggleNode(nodes, callback)(id, true)
}


export const toggleNode = (nodes, callback) => (id, bool) => {
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
