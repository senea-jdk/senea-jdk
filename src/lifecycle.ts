import {
  saveUserBehavior,
  isFirstRender,
  saveClient,
  changeFirstRender,
  updateStayTime,
  getStore,
  resetStore
} from './store'
import { getOS, getBrowser, isWatchedUrl, post } from './util'
import pkg from '../package.json'

export function beforeRouteEnter() {
  // 统计页面停留时间
  performance.mark('load')
  // 开启页面用户行为统计
  saveUserBehavior({
    type: 'navigation',
    step: 0,
    target: '',
    offsetx: 0,
    offsety: 0
  })
  const firstRender = isFirstRender()
  if (firstRender) {
    // 终端的环境信息只需要计算一次
    saveClient({
      ua: navigator.userAgent,
      os: getOS(),
      browser: getBrowser(),
      ip: '',
      jdk: pkg.version,
      pid: '',
      pversion: '',
      uid: '',
      sid: '',
      token: ''
    })
    changeFirstRender(false)
  }
}

export function beforeRouteLeave() {
  performance.mark('unload')
  performance.measure('staytime', 'load', 'unload')
  const staytime = performance.getEntriesByName('staytime')
  updateStayTime(staytime[0].duration)
  performance.clearMarks()
  performance.clearMeasures()
  if (isWatchedUrl()) {
    const store = getStore()
    // 上报监控数据
    post(store)
  }
  resetStore()
}
