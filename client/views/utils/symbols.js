export const symbolTypes = {
  // todo: CUSTOM: 'CUSTOM',
  SERVICE: 'SERVICE'
}

export const symbolTypeToName = {
  [symbolTypes.SERVICE]: ({prefix} = {}) => {
    const name = 'service'
    if (prefix) return `un ${name}`
    return name
  }
}
