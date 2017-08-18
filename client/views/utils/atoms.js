export const atomTypes = {
  DEPARTMENT: 'DEPARTMENT',
  LOCATION: 'LOCATION',
  MONAD: 'MONAD'
}

export const atomTypeToName = {
  [atomTypes.DEPARTMENT]: ({prefix} = {}) => {
    const name = 'departement'
    if (prefix) return `un ${name}`
    return name
  },
  [atomTypes.LOCATION]: ({prefix} = {}) => {
    const name = 'lieu'
    if (prefix) return `un ${name}`
    return name
  },
  [atomTypes.MONAD]: ({prefix} = {}) => {
    const name = 'personne'
    if (prefix) return `une ${name}`
    return name
  }
}
