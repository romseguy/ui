export default function watchQuery({channel, client, query}) {
  if (window.offlineMode) {
    return {}
  }

  const queryObservable = client.watchQuery({query})

  const querySubscription = queryObservable.subscribe({
    next: results => {
      console.debug(`watchQuery ${query.definitions[0].name.value} next`)
      channel.put({
        type: 'QUERY_OK',
        payload: {
          results
        }
      })
    },
    error: error => {
      console.debug(`watchQuery ${query.definitions[0].name.value} error`)
      channel.put({
        type: 'QUERY_NOK',
        payload: error,
        error: true
      })
    }
  })

  return querySubscription
}
