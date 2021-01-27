# senea-sdk

一键开启前端监控。

## 默认配置

```js
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
Senea.init({
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
})
```
