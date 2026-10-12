let wowInstance = null

export function initializeWow() {
  if (typeof window.WOW !== 'function') {
    throw new Error('WOW.js failed to load')
  }

  wowInstance = new window.WOW({ animateClass: 'animate__animated' })
  wowInstance.init()

  return () => {
    wowInstance.stop()
    wowInstance = null
  }
}

export function getWowInstance() {
  return wowInstance
}
