import { getUuid } from '../util'

const TRACKING_ID = 'UA-12345-1'

const NULL_VALUE = '(not set)'

let senea: Window['senea']

export const init = () => {
  senea = window.senea =
    window.senea ||
    ((...args) => (window.senea.q = window.senea.q || []).push(args))

  createTracker()
  trackErrors()
  trackRuntime()
  sendInitialPageview()
  sendNavigationTimingMetrics()
}

const createTracker = () => {
  senea('create', TRACKING_ID, 'auto')
  senea('set', 'transport', 'beacon')
}

const trackErrors = () => {
  const loadErrorEvents = (window.senea_e && window.senea_e.q) || []

  const trackErrorEvent = (event: ErrorEvent) => {
    const fieldsObj = { eventCategory: 'Uncaught Error' }

    const err = event.error || {
      message: `${event.message} (${event.lineno}:${event.colno})`
    }

    trackError(err, fieldsObj)
  }

  // 处理该文件加载前收集的ErrorEvent
  for (let event of loadErrorEvents) {
    trackErrorEvent(event)
  }

  window.addEventListener('error', trackErrorEvent)
}

export const trackError = (err: any = {}, fieldsObj = {}) => {
  senea(
    'send',
    'event',
    Object.assign(
      {
        eventCategory: 'Error',
        eventAction: err.name || '(no error name)',
        eventLabel: `${err.message}\n${err.stack || '(no stack trace)'}`,
        eventValue: true
      },
      fieldsObj
    )
  )
}

const trackRuntime = () => {
  senea((tracker: any) => {
    tracker.set({
      clientId: tracker.get('clientId'),
      windowId: getUuid()
    })
  })
}

const sendInitialPageview = () => {
  senea('send', 'pageview', { page: window.location.pathname })
}

const sendNavigationTimingMetrics = () => {
  if (!window.performance) return

  if (document.readyState != 'complete') {
    window.addEventListener('load', sendNavigationTimingMetrics)
    return
  }

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

  const navTiming = {
    dns: Math.round(domainLookupEnd - domainLookupStart),
    tcp: Math.round(connectEnd - connectStart),
    ssl: Math.round(
      secureConnectionStart === 0 ? 0 : connectEnd - secureConnectionStart
    ),
    ttfb: Math.round(responseStart - requestStart),
    trans: Math.round(responseEnd - responseStart),
    dom: Math.round(domInteractive - responseEnd),
    res: Math.round(loadEventStart - domContentLoadedEventEnd),
    firstbyte: Math.round(responseStart - domainLookupStart),
    fpt: Math.round(responseEnd - fetchStart),
    tti: Math.round(domInteractive - fetchStart),
    ready: Math.round(domContentLoadedEventEnd - fetchStart),
    load: Math.round(loadEventStart - fetchStart)
  }
  const navType = type

  // In some edge cases browsers return very obviously incorrect NT values,
  // e.g. 0, negative, or future times. This validates values before sending.
  const allValuesAreValid = (values: number[]) => {
    return values.every((value) => value > 0 && value < 6e6)
  }

  if (allValuesAreValid(Object.values(navTiming))) {
    senea('send', 'event', {
      eventCategory: 'Navigation Timing',
      eventAction: 'track',
      eventLabel: NULL_VALUE,
      nonInteraction: true,
      navTiming,
      navType
    })
  }
}
