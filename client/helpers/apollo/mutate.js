import { noop } from 'lodash'
import debug from 'helpers/debug'


async function mutate(client, {mutation, refetchQueries, variables}, {from} = {}) {
  let log = noop

  if (process.env.NODE_ENV === 'development') {
    const operationName = mutation.definitions[0].name.value
    log = data => debug(
      `[GRAPHQL] ${from ? `${from} ` : ''}ran \`${operationName}\` mutation`,
      data ? data[operationName] : data
    )
  }

  const {data} = await client.mutate({mutation, refetchQueries, variables})
  log(data)

  return data
}

export default mutate
