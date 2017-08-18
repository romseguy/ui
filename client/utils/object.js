export const removeUndefinedProperties = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }

    return acc;
  }, {})
}
