export default ({ request, options }, next) => {
  if (!options.headers) {
    options.headers = {}  // Create the header object if needed.
  }
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token')

  if (token) {
    options.headers.Authorization = token ? `Bearer ${token}` : null
  }

  next()
}
