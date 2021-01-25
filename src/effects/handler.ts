import { isValidUrl } from '../util'
import {
  errors,
  navPerfs,
  resourcesPerfs,
  apiPerfs,
  behaviors,
  getStore,
  reset
} from '../store'
import { post } from '../reporter'
import { pageWillUnmounted } from '../lifecycle'

export function handleError(e: Event) {
  if (isValidUrl() && e.isTrusted) {
    if (e instanceof ErrorEvent) {
      errors.push({
        type: e.type,
        timeStamp: e.timeStamp,
        message: e.error.message,
        stack: e.error.stack,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      })
    } else if (e instanceof Event) {
      const target = e.target
      if (target instanceof Element) {
        errors.push({
          type: e.type,
          timeStamp: e.timeStamp,
          message: 'network error in ' + target?.outerHTML,
          stack: '',
          filename: '',
          lineno: 0,
          colno: 0
        })
      } else {
        errors.push({
          type: e.type,
          timeStamp: e.timeStamp,
          message: 'unknown error',
          stack: '',
          filename: '',
          lineno: 0,
          colno: 0
        })
      }
    }
  }
}

export function handleRejection(e: PromiseRejectionEvent) {
  if (isValidUrl() && e.isTrusted) {
    errors.push({
      type: e.type,
      timeStamp: e.timeStamp,
      message: e.reason,
      stack: '',
      filename: '',
      lineno: 0,
      colno: 0
    })
  }
}

export function handleBehaviorClick(e: MouseEvent) {
  if (isValidUrl() && e.isTrusted) {
    const target = e.target
    if (target instanceof Element) {
      behaviors.push({
        type: 'click',
        step: 1,
        target: target.nodeName,
        offsetx: target.clientLeft,
        offsety: target.clientTop
      })
    }
  }
}

export function handleApiPerf(e: CustomEvent) {
  if (isValidUrl() && e.isTrusted) {
    apiPerfs.push(e.detail.payload)
  }
}

export function handleBeforeUnload() {
  pageWillUnmounted()
  if (isValidUrl()) {
    const store = getStore()
    post(store)
  }
  reset()
}

export function handleNavPerf() {
  const [
    {
      connectEnd,
      connectStart,
      domContentLoadedEventEnd,
      domInteractive,
      domainLookupEnd,
      domainLookupStart,
      fetchStart,
      loadEventStart,
      requestStart,
      responseEnd,
      responseStart,
      secureConnectionStart,
      type
    }
  ] = performance.getEntriesByType(
    'navigation'
  ) as PerformanceNavigationTiming[]
  const navTimes = {
    dns: domainLookupEnd - domainLookupStart,
    tcp: connectEnd - connectStart,
    ssl: secureConnectionStart === 0 ? 0 : connectEnd - secureConnectionStart,
    ttfb: responseStart - requestStart,
    trans: responseEnd - responseStart,
    dom: domInteractive - responseEnd,
    res: loadEventStart - domContentLoadedEventEnd,
    firstbyte: responseStart - domainLookupStart,
    fpt: responseEnd - fetchStart,
    tti: domInteractive - fetchStart,
    ready: domContentLoadedEventEnd - fetchStart,
    load: loadEventStart - fetchStart,
    navtype: type
  }
  navPerfs.push(navTimes)
}

export function handleResourcePerf(timeout: number) {
  const resourceTimes = performance.getEntriesByType(
    'resource'
  ) as PerformanceResourceTiming[]
  resourceTimes.forEach((item) => {
    if (item.responseEnd - item.startTime >= timeout) {
      resourcesPerfs.push(item.name)
    }
  })
}
