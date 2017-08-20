export const atomTypes = {
  DEPARTMENT: 'DEPARTMENT',
  LOCATION: 'LOCATION',
  PERSON: 'PERSON'
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
  [atomTypes.PERSON]: ({prefix} = {}) => {
    const name = 'personne'
    if (prefix) return `une ${name}`
    return name
  }
}
