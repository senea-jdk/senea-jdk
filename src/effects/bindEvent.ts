import {
  getGlobalConfig,
  calcAndSaveNavPerf,
  calcAndSaveResourcePerf
} from '../store'
import {
  handleRouteLeave,
  handleError,
  handleBehaviorClick,
  handleRejection
} from './handler'
import spaPlugin from '../plugins/spa'
import requestPlugin from '../plugins/request'

function bindEvent() {
  const config = getGlobalConfig()
  if (config.openException) {
    onError()
  }
  if (config.spa) {
    spaPlugin.install()
  }
  if (config.openPerf) {
    requestPlugin.install()
  }
  window.onload = (e: Event) => {
    if (config.openPerf) {
      calcAndSaveNavPerf()
      calcAndSaveResourcePerf(config.resourceTimeout)
    }
    if (config.openBehavior) {
      onUserBehavior(config.behaviorActions)
    }
    window.addEventListener('beforeunload', handleRouteLeave)
  }
}

function onError() {
  // 全局监听异常
  window.addEventListener('error', handleError, true)
  // 监听未处理的Promise异常
  window.addEventListener('unhandledrejection', handleRejection)
}

function onUserBehavior(actions: GlobalConfig['behaviorActions']) {
  actions.forEach((action) => {
    if (action === 'click') {
      window.addEventListener('click', handleBehaviorClick)
    }
  })
}

export default bindEvent
