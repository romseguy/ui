export default async function query({client, query, variables}, {cache} = {}) {
  if (window.offlineMode) {
    return {}
  }

  const operationName = query.definitions[0].name.value

  if (cache) {
    console.debug(`query ${operationName} from cache`)
    return client.readQuery({query, variables})
  }

  console.debug(`query ${operationName} from network`)
  const {data} = await client.query({fetchPolicy: 'network-only', query, variables:})

  return data
}
