import { GlobalConfig, userEnv } from './store'
import { bindEvent } from './effects/effect'
import { pageWillMount } from './lifecycle'
import { getOS, getBrowser } from './util'
import pkg from '../package.json'

export function init(config: GlobalConfig) {
  pageWillMount()
  Object.assign(GlobalConfig.current, config)
  userEnv.push({
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
  bindEvent(config)
}
