import { handleBeforeUnload } from '../effects/handler'
import { pageWillMount } from '../lifecycle'

function dispatchSpaUnloadEvent(payload: any) {
  const spaUnloadEvent = new CustomEvent('spaunload', {
    detail: {
      payload
    }
  })
  window.dispatchEvent(spaUnloadEvent)
}

function plugin() {
  // window.addEventListener('popstate', () => {
  //   dispatchSpaUnloadEvent({
  //     originAction: 'popstate'
  //   })
  // })
  window.addEventListener('hashchange', () => {
    dispatchSpaUnloadEvent({
      originAction: 'hashchange'
    })
  })
  const _pushState = history.pushState
  const _replaceState = history.replaceState
  history.pushState = (...args) => {
    dispatchSpaUnloadEvent({
      originAction: 'pushState'
    })
    _pushState(...args)
  }
  history.replaceState = (...args) => {
    dispatchSpaUnloadEvent({
      originAction: 'replaceState'
    })
    _replaceState(...args)
  }
  // spa每次路由变更
  window.addEventListener('spaunload', handleSpaUnload)
}

function handleSpaUnload() {
  handleBeforeUnload()
  pageWillMount()
}

export default plugin
