import { noop } from 'lodash'
import debug from 'helpers/debug'


async function query({client, query, variables}, {cache, from} = {}) {
  let log = noop

  if (process.env.NODE_ENV === 'development') {
    const operationName = query.definitions[0].name.value
    log = (cache, data) => debug(
      `[GRAPHQL] ${from ? `${from} ` : ''}ran \`${operationName}\` query against ${cache ? 'cache' : 'network'}`,
      data ? data[operationName] : data
    )
  }

  if (cache) {
    try {
      const data = client.readQuery({query, variables})
      log(true, data)
      return data
    } catch (e) {
      const {data} = await client.query({fetchPolicy: 'network-only', query, variables})
      log(false, data)
      return data
    }
  }

  const {data} = await client.query({fetchPolicy: 'network-only', query, variables})
  log(false, data)

  return data
}

export default query
