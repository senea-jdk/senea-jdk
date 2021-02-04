// 终端信息，通常在页面加载之初就能确定，之后不会改变
let client: Client | undefined
// 异常数据
const errors: Exception[] = []
// 用户行为数据
const behaviors: UserBehavior[] = []
// 接口调用性能数据
const apiPerfs: APIPerf[] = []
// 页面加载过程性能数据，包含网络通讯和浏览器渲染
let navPerfs: NavPerf | undefined
// 页面外部异步资源
let resourcesPerfs: string[] = []
// 区分spa
let firstRender = true
// 全局配置
let config: GlobalConfig = {
  pid: '',
  uid: '',
  sid: '',
  token: '',
  spa: true,
  includePaths: [],
  excludePaths: [],
  reportUrl: '',
  openPerf: true,
  openException: true,
  openBehavior: true,
  behaviorActions: ['click'],
  maxMsgLength: 10,
  resourceTimeout: 5000
}
// 当前页面用户操作深度
let step = 0
// 用户在当前页面的停留时间
let staytime = 0

export function changeFirstRender(tag: boolean) {
  firstRender = tag
}

export function isFirstRender() {
  return firstRender
}

export function saveClient(data: Client) {
  client = data
}

export function saveError(data: Exception) {
  errors.push(data)
}

export function saveUserBehavior(data: UserBehavior) {
  behaviors.push(data)
}

export function saveAPIPerf(data: APIPerf) {
  apiPerfs.push(data)
}

export function saveGlobalConfig(data: GlobalConfig) {
  Object.assign(config, data)
}

export function getGlobalConfig() {
  return config
}

export function getStep() {
  return step++
}

export function updateStayTime(time: number) {
  staytime = time
}

// spa需要reset
export function resetStore() {
  step = 0
  staytime = 0
  errors.splice(0, errors.length)
  behaviors.splice(0, behaviors.length)
  apiPerfs.splice(0, apiPerfs.length)
  window.__senea_store__ = getStore()
}

export function getStore() {
  const store = {
    client,
    runtime: getPageRuntime(),
    errors,
    behaviors,
    apiPerfs,
    navPerfs,
    resourcesPerfs
  }
  return store
}

function getPageRuntime(): PageRuntime {
  const loc = window.location
  const runtime = {
    origin: decodeURIComponent(loc.origin),
    pathname: decodeURIComponent(loc.pathname),
    hash: decodeURIComponent(loc.hash),
    search: decodeURIComponent(loc.search),
    referrer: document.referrer,
    sr: `${window.screen.width}/${window.screen.height}`,
    screenColorDepth: window.screen.colorDepth,
    dpr: window.devicePixelRatio,
    lang: window.navigator.language,
    title: document.title,
    de: document.charset,
    stay: staytime
  }
  return runtime
}

export function calcAndSaveNavPerf() {
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
  navPerfs = {
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
}

export function calcAndSaveResourcePerf(timeout: number) {
  const resourceTimes = performance.getEntriesByType(
    'resource'
  ) as PerformanceResourceTiming[]
  resourceTimes.forEach((item) => {
    if (item.responseEnd - item.startTime >= timeout) {
      resourcesPerfs.push(item.name)
    }
  })
}
