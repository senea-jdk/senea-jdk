import { GlobalConfig } from './store'
import { warn } from './util'

export function sendBeacon(data: any) {
  if (typeof window.navigator.sendBeacon === 'function') {
  } else {
    warn('navigator.sendBeacon not surported')
  }
}

function dispatchApiPerfEvent(payload: any) {
  const apiPerfEvent = new CustomEvent('apiperf', {
    detail: {
      payload
    }
  })
  window.dispatchEvent(apiPerfEvent)
}

export function post(data: object) {
  const config = GlobalConfig.current
  if (typeof window.XMLHttpRequest === 'function') {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', config.reportUrl, true)
    xhr.setRequestHeader('Content-Type', 'text/plain')
    const startTime = +new Date()
    xhr.send(JSON.stringify(data))
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4) {
        dispatchApiPerfEvent({
          url: config.reportUrl,
          code: xhr.status,
          message: e.type,
          method: 'POST',
          duration: +new Date() - startTime
        })
      }
    }
  } else {
    warn('浏览器不支持XMLHttpRequest')
  }
}
