import debug from 'helpers/debug'
import getCurrentBreakpoint from 'helpers/getCurrentBreakpoint'


export default function initializeWindow(window) {
  if (!window) {
    return
  }

  window.offlineMode = false

  window.currentBreakpoint = getCurrentBreakpoint(window.innerWidth)

  debug(`current breakpoint is ${currentBreakpoint}`)

  window.addEventListener('resize', function onWindowResize() {
    if (getCurrentBreakpoint(window.innerWidth) !== window.currentBreakpoint) {
      window.currentBreakpoint = getCurrentBreakpoint(window.innerWidth)

      debug(`current breakpoint is ${window.currentBreakpoint}`)
    }
  })
}
