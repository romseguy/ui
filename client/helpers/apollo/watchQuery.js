import debug from 'helpers/debug'


export default function watchQuery({channel, client, query, variables}) {
  const queryObservable = client.watchQuery({query, variables})

  const querySubscription = queryObservable.subscribe({
    next: results => {
      debug(`[GRAPHQL] watchQuery ${query.definitions[0].name.value} next`, results.data)

      channel.put({
        type: 'QUERY_OK',
        payload: {
          results
        }
      })
    },
    error: error => {
      debug(`[GRAPHQL] watchQuery ${query.definitions[0].name.value} error`, error)

      channel.put({
        type: 'QUERY_NOK',
        payload: error,
        error: true
      })
    }
  })

  return querySubscription
}
