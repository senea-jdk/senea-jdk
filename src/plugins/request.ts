import { isWatchedUrl, warn } from '../util'
import { saveAPIPerf } from '../store'

function dispatchApiPerfEvent(payload: any) {
  const apiPerfEvent = new CustomEvent('apiperf', {
    detail: {
      payload
    }
  })
  window.dispatchEvent(apiPerfEvent)
}

function hackFetch() {
  if (typeof window.fetch === 'function') {
    const startTime = Date.now()
    const _fetch = window.fetch
    window.fetch = (...args) => {
      return _fetch.apply(window, args).then((result) => {
        result = result.clone()
        let headers = result.headers
        let method = ''
        if (headers && 'function' === typeof headers.get) {
          method = headers.get('method') || ''
          const ct = headers.get('content-type')
          if (ct && !/(text)|(json)/.test(ct)) return result
        }
        result.text().then(function (content) {
          if (result.ok) {
          } else {
          }
          dispatchApiPerfEvent({
            url: result.url,
            code: result.status,
            message: result.statusText,
            method,
            duration: +Date.now() - startTime
          })
        })
        return result
      })
      // .catch((reason) => {
      //   return reason
      // })
    }
  }
}

function hackAjax() {
  if (typeof window.XMLHttpRequest === 'function') {
    const _XMLHttpRequest = window.XMLHttpRequest
    // @ts-ignore
    window.XMLHttpRequest = function () {
      const xhr = new _XMLHttpRequest()
      if (!xhr.addEventListener) return xhr

      const _send = xhr.send
      let startTime = 0
      xhr.send = function (...sendArgs) {
        startTime = Date.now()
        _send.apply(xhr, sendArgs)
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          dispatchApiPerfEvent({
            url: xhr.responseURL,
            code: xhr.status,
            message: xhr.statusText,
            method: xhr.getResponseHeader('method'),
            duration: Date.now() - startTime
          })
        }
      }
      return xhr
    }
  }
}

function handleApiPerf(e: CustomEvent) {
  if (isWatchedUrl() && e.isTrusted) {
    saveAPIPerf(e.detail.payload)
  }
}

function install() {
  hackFetch()
  hackAjax()
  // @ts-ignore
  window.addEventListener('apiperf', handleApiPerf)
}

export default { install }
