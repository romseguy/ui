import { noop } from 'lodash'
import debug from 'helpers/debug'


async function query({client, query, variables}, {cache, from} = {}) {
  let log = noop

  if (process.env.NODE_ENV === 'development') {
    const operationName = query.definitions[0].name.value
    log = cache => debug(
      `[GRAPHQL] ${from ? `${from} ` : ''}ran \`${operationName}\` query against ${cache ? 'cache' : 'network'}`
    )
  }

  if (cache) {
    try {
      log(true)
      const data = client.readQuery({query, variables})

      return data
    } catch (e) {
      log(false)
      const {data} = await client.query({fetchPolicy: 'network-only', query, variables})

      return data
    }
  }

  const {data} = await client.query({fetchPolicy: 'network-only', query, variables})
  log(false, data)

  return data
}

export default query
