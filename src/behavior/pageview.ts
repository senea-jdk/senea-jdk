let timerId = 0

function install() {
  window.addEventListener('visibilitychange', () => {
    const visibilityState = document.visibilityState
    if (visibilityState === 'visible') {
    }
  })
}

export { install }
