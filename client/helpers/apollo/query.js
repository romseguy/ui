import debug from 'helpers/debug'


async function query({client, query, variables}, {cache, from} = {}) {
  let str = ''

  if (process.env.NODE_ENV === 'development') {
    const operationName = query.definitions[0].name.value
    str = `[GRAPHQL] ${from ? `${from} ` : ''}ran \`${operationName}\` query against `
  }

  if (cache) {
    try {
      const data = client.readQuery({query, variables})
      debug(str + 'cache', data)
      return data
    } catch (e) {
      const {data} = await client.query({fetchPolicy: 'network-only', query, variables})
      debug(str + 'network', data)
      return data
    }
  }

  const {data} = await client.query({fetchPolicy: 'network-only', query, variables})
  debug(str + 'network', data)

  return data
}

export default query
