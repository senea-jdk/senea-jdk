declare module '*.json'

type DataType = 'error' | 'perf' | 'behavior'

interface Window {
  CustomEvent: any
  __senea_store__: any
}

interface GlobalStore extends Client, PageRuntime {
  errors: Exception[]
  perfs: NavPerf[]
  behaviors: UserBehavior[]
  apiPerfs: APIPerf[]
  timeoutResources: string[]
}

/**
 * pid 项目id
 * uid userid
 * sid sessionid
 * token
 * spa 是否支持spa项目
 * includePaths 只监控指定的pathname，优先级高于excludePaths
 * excludePaths 不监控指定的pathname
 * reportUrl 上报的后台地址
 * openPerf 是否监控性能
 * openException 是否监控异常
 * openBehavior 是否监控用户行为
 * behaviorActions 监控用户的哪些行为，比如['click']
 * maxMsgLength 说明性字段的最大长度
 * resourceTimeout 异步资源加载超时上报阈值
 */
interface GlobalConfig {
  pid: string
  uid: string
  sid: string
  token: string
  spa: boolean
  includePaths: string[]
  excludePaths: string[]
  reportUrl: string
  openPerf: boolean
  openException: boolean
  openBehavior: boolean
  behaviorActions: string[]
  maxMsgLength: number
  resourceTimeout: number
}

/**
 * ua 浏览器的userAgent
 * os 操作系统
 * ip IP地址
 * sdk sdk版本
 * pid 项目id
 * pversion 项目迭代版本
 * uid userid
 * sid sessionid
 * token 是否过期
 */
interface Client {
  ua: string
  browser: string
  os: string
  ip: string
  sdk: string
  pid: string
  pversion: string
  uid: string
  sid: string
  token: string
}

/**
 * pathname 当前页面pathname
 * domain 当前页面域名
 * hash 当前页面hash
 * protocol 请求协议
 * referrer 上个url
 * sr 页面分辨率
 * screenColorDepth 页面颜色深度
 * dpr 设备像素比
 * lang 页面语言
 * title 页面标题
 * de document编码
 * stay 页面停留时间(onbeforeunloadTime - onloadTime)
 */
interface PageRuntime {
  pathname: string
  domain: string
  hash: string
  protocol: string
  referrer: string
  sr: string
  screenColorDepth: number
  dpr: number
  lang: string
  title: string
  de: string
  stay: number
}

/**
 * type 事件类型
 * timeStamp 时间戳ms
 * message 错误信息
 * stack 事件流所经过的 DOM 节点组成的数组(Event.deepPath)
 * filename 发生错误所在的文件
 * lineno 第几行
 * colno 第几列
 */
interface Exception {
  type: string
  timeStamp: number
  message: string
  stack: string
  filename: string
  lineno: number
  colno: number
}

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
interface NavPerf {
  dns: number
  tcp: number
  ssl: number
  ttfb: number
  trans: number
  dom: number
  res: number
  firstbyte: number
  fpt: number
  tti: number
  ready: number
  load: number
  bandWidth?: number
  navtype: string
}

/**
 * url 接口地址
 * duration 请求耗时
 * code http状态码
 * message 信息
 * method get/post
 */
interface APIPerf {
  url: string
  duration: number
  code: number
  message: string
  method: string
}

/**
 * type 行为类型
 * 每次路由reset ClickBehavior.step = 0
 * step 当前页面用户每点击一次+1，表示操作深度
 * target 目标节点名
 */
interface UserBehavior {
  type: 'navigation' | 'click'
  step: number
  target: string
  offsetx: number
  offsety: number
}
