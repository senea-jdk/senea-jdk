// 终端信息，通常在页面加载之初就能确定，之后不会改变
export const userEnv: UserEnv[] = []
// 异常数据
export const errors: EventData[] = []
// 用户行为数据
export const behaviors: Behavior[] = []
// 接口调用性能数据
export const apiPerfs: APIData[] = []
// 页面加载过程性能数据，包含网络通讯和浏览器渲染
export const navPerfs: NavTiming[] = []
// 页面外部异步资源
export const resourcesPerfs: string[] = []

export const GlobalConfig: { current: GlobalConfig } = {
  current: {
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
}
// 当前页面用户操作深度
let step = 0
// 用户在当前页面的停留时间
let staytime = 0

export function nextStep() {
  return step++
}
export function resetStep() {
  step = 0
}

export function updateStayTime(time: number) {
  staytime = time
}

// spa需要reset
export function reset() {
  step = 0
  staytime = 0
  errors.splice(0, errors.length)
  behaviors.splice(0, behaviors.length)
  apiPerfs.splice(0, apiPerfs.length)
}

export function getStore() {
  const store = {
    userEnv: userEnv[0],
    runtime: getRuntime(),
    errors,
    behaviors,
    apiPerfs,
    navPerfs: navPerfs[0],
    resourcesPerfs: resourcesPerfs[0]
  }
  return store
}

function getRuntime(): Runtime {
  const loc = window.location
  const runtime = {
    pathname: loc.pathname,
    domain: loc.host,
    hash: loc.hash,
    protocol: loc.protocol,
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
