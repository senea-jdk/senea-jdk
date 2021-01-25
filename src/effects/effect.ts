import {
  handleError,
  handleRejection,
  handleBehaviorClick,
  handleBeforeUnload,
  handleNavPerf,
  handleResourcePerf,
  handleApiPerf
} from './handler'
import { GlobalConfig } from '../store'
import spaPlugin from '../plugins/spa'
import { pageDidMounted } from '../lifecycle'

export function bindEvent(config: GlobalConfig) {
  const { openPerf, openException, openBehavior, behaviorActions } = config
  if (openException) {
    bindError()
  }
  window.onload = (e: Event) => {
    pageDidMounted()
    if (openPerf) {
      bindAPIPerf()
    }
    if (openBehavior) {
      bindBehavior(behaviorActions)
    }
    bindBeforeUnload()
  }
}

function bindError() {
  // 全局监听异常
  window.addEventListener('error', handleError, true)
  // 监听未处理的Promise异常
  window.addEventListener('unhandledrejection', handleRejection)
}

function bindAPIPerf() {
  // @ts-ignore
  window.addEventListener('apiperf', handleApiPerf)
}

function bindBehavior(actions: GlobalConfig['behaviorActions']) {
  actions.forEach((action) => {
    if (action === 'click') {
      window.addEventListener('click', handleBehaviorClick)
    }
  })
}

function bindBeforeUnload() {
  window.addEventListener('beforeunload', handleBeforeUnload)
  const config = GlobalConfig.current
  if (config.spa) {
    spaPlugin()
  }
}
