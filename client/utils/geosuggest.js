export function getSuggestedCity(suggest) {
  const address_component = suggest.gmaps.address_components.find(address_component => {
    return address_component.types.includes('locality')
  })

  return address_component.short_name
}

export function getSuggestedDepartment(suggest) {
  const address_component = suggest.gmaps.address_components.find(address_component => {
    return address_component.types.includes('administrative_area_level_2')
  })

  return address_component.short_name
}

export function keepCities(suggest) {
  return !suggest.types.includes('locality')
}
