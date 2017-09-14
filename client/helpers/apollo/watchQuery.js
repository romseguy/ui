export default function watchQuery({channel, client, query, variables}) {
  const queryObservable = client.watchQuery({query, variables})

  const querySubscription = queryObservable.subscribe({
    next: results => {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[GRAPHQL] watchQuery ${query.definitions[0].name.value} next`, results.data)
      }

      channel.put({
        type: 'QUERY_OK',
        payload: {
          results
        }
      })
    },
    error: error => {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[GRAPHQL] watchQuery ${query.definitions[0].name.value} error`, error)
      }

      channel.put({
        type: 'QUERY_NOK',
        payload: error,
        error: true
      })
    }
  })

  return querySubscription
}
