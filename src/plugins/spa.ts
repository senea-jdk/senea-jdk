import { beforeRouteEnter, beforeRouteLeave } from '../lifecycle'

function dispatchSpaUnloadEvent(payload: any) {
  const spaUnloadEvent = new CustomEvent('spaunload', {
    detail: {
      payload
    }
  })
  window.dispatchEvent(spaUnloadEvent)
}

function hackHistory() {
  const _pushState = history.pushState
  const _replaceState = history.replaceState
  history.pushState = (...args) => {
    dispatchSpaUnloadEvent({
      originAction: 'pushState'
    })
    _pushState.apply(history, args)
  }
  history.replaceState = (...args) => {
    dispatchSpaUnloadEvent({
      originAction: 'replaceState'
    })
    _replaceState.apply(history, args)
  }
}

function handleSpaUnload() {
  beforeRouteLeave()
  beforeRouteEnter()
}

function install() {
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
  hackHistory()
  // spa每次路由变更
  window.addEventListener('spaunload', handleSpaUnload)
}

export default { install }
