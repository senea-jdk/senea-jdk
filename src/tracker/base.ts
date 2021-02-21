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
  senea('create', TRACKING_ID)
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
      clientId: tracker.getField('clientId'),
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

  /**
   * dns dns耗时(domainLookupEnd - domainLookupStart)
   * tcp tcp耗时(connectEnd - connetStart)
   * ssl ssl耗时(connectEnd - secureConnectionStart)
   * ttfb 网络耗时(responseStart - requestStart)
   * trans 数据传输耗时(responseEnd - responseStart)
   * dom dom解析耗时(domInteractive - responseEnd)
   * res 同步资源加载耗时(loadEventStart - domContentLoadedEventEnd)
   * firstbyte 首包到达耗时(responseStart - domainLookupStart)
   * fpt 首次渲染耗时或白屏时间(responseEnd - fetchStart)
   * tti 首次可交付耗时(domInteractive - fetchStart)
   * ready 加载完成耗时(domContentLoadEventEnd - fetchStart)
   * load 页面完全加载时间(loadEventStart - fetchStart)
   * bandWidth 估计的带宽 单位M/s(window.navigator.connection.bandWidth)
   * navtype nav方式 如reload(type)
   */
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

  // In some edge cases browsers return very obviously incorrect NT values,
  // e.g. 0, negative, or future times. This validates values before sending.
  const allValuesAreValid = (values: number[]) => {
    return values.every((value) => value > 0 && value < 6e6)
  }

  if (allValuesAreValid(Object.values(navTiming))) {
    senea('send', 'performance', {
      type,
      timing: navTiming
    })
  }
}
