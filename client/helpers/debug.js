export default function debug (...args) {
  if (process.env.NODE_ENV === 'development' && window.debug) {
    console.info(...args)
  }
}
