import UsageManager from './UsageManager'

// 全局的记录方法使用情况的对象
var globalUM = new UsageManager()

// 快捷的记录使用情况的方法
function reg(idx) {
  globalUM.set(idx)
}

// 更新传入配置的 USAGE_MANAGER
var setModelUM = function (model, idx) {
  var um = new UsageManager(getCurUM(model))
  um.set(idx)
  model.set(USAGE_MANAGER, um.umMap)
}

/**
 * 获取指定model里面的 USAGE_MANAGER 值，然后和全局的 globalUM 合并，然后encode
 * @return {string}
 */
var mergeAndEncodeUM = function (model) {
  var umArray = getCurUM(model)
  var modelUM = new UsageManager(umArray)
  var globalUMCopy = globalUM.umMap.slice()
  for (var i = 0; i < modelUM.umMap.length; i++) {
    globalUMCopy[i] = globalUMCopy[i] || modelUM.umMap[i]
  }
  return new UsageManager(globalUMCopy).encode()
}

// 获取配置中的USAGE_MANAGER，如果没有则返回空数组
var getCurUM = function (model) {
  var umArray = model.get(USAGE_MANAGER)
  if (!isArray(umArray)) {
    umArray = []
  }
  return umArray
}

function buildHitTaskFunc(model) {
  try {
    if (win.navigator.sendBeacon) {
      reg(42)
    } else if (
      win.XMLHttpRequest &&
      'withCredentials' in new win.XMLHttpRequest()
    ) {
      reg(40)
    }
  } catch (c) {}

  model.set(USAGE, mergeAndEncodeUM(model), true)
  model.set(_S, getNumber(model, _S) + 1)
  var b = []
  hookMap.map(function (c, hook) {
    if (hook.paramName) {
      var e = a.get(c)
      // 不为空、不是默认值的键值对，才会被上传
      if (undefined != e && e != d.defaultValue) {
        // boolean类型转换成数字
        if ('boolean' == typeof e) {
          e *= 1
        }
        b.push(d.paramName + '=' + encodeURIComponent('' + e))
      }
    }
  })
  b.push('z=' + uuid())
  model.set(HIT_PAYLOAD, b.join('&'), true)
}

// 发送任务的任务
function sendHitTaskFunc(model) {
  var api = getString(model, TRANSPORT_URL) || getGAOrigin() + '/collect'
  var transportValue = getString(model, TRANSPORT)
  if (!transportValue && model.get(USE_BEACON)) {
    transportValue = 'beacon'
  }

  if (transportValue) {
    var params = getString(model, HIT_PAYLOAD)
    var hitCallbackFunc = model.get(HIT_CALLBACK)
    hitCallbackFunc = hitCallbackFunc || noop
    'image' == transportValue
      ? imgPing(api, params, hitCallbackFunc)
      : ('xhr' == transportValue && xhrPing(api, params, hitCallbackFunc)) ||
        ('beacon' == transportValue &&
          beaconPing(api, params, hitCallbackFunc)) ||
        smartPing(api, params, hitCallbackFunc)
  } else {
    smartPing(api, getString(model, HIT_PAYLOAD), model.get(HIT_CALLBACK))
  }

  model.set(HIT_CALLBACK, noop, true)
}

// 这个 task 用于限制发送的频率
// 每个 analytics.js 跟踪器对象从 20 次可发送额度开始，并以每秒 2 次额度的速度获得补充。适用于除电子商务（商品或交易）之外的所有匹配
function rtlTaskFunc(model) {
  // 当前页面的发送总数
  var hitCount = getNumber(model, HIT_COUNT)
  if (hitCount >= 500) {
    // 超过500记录下
    reg(15)
  }
  var hitTypeV = getString(model, HIT_TYPE)
  if ('transaction' != hitTypeV && 'item' != hitTypeV) {
    var avaliable = getNumber(model, AVALIABLE_COUNT)
    var time = new Date().getTime()
    var lastSendTime = getNumber(model, LAST_SEND_TIME)
    if (lastSendTime == 0) {
      model.set(LAST_SEND_TIME, time)
    }

    // 每秒 2 次额度的速度获得补充
    var newAvaliable = Math.round((2 * (time - lastSendTime)) / 1e3)
    if (newAvaliable > 0) {
      // 最多 20 次额度
      avaliable = Math.min(avaliable + newAvaliable, 20)
      model.set(LAST_SEND_TIME, time)
    }

    // 额度用完，此次发送取消
    if (avaliable <= 0) {
      throw 'abort'
    }
    // 每次发送消耗掉
    model.set(AVALIABLE_COUNT, --avaliable)
  }
  model.set(HIT_COUNT, ++hitCount)
}
