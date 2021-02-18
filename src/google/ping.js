var googleURL = /^(www\.)?google(\.com?)?(\.[a-z]{2})?$/
var doubleclickURL = /(^|\.)doubleclick\.net$/i

// 获取GA请求源的地址
var getGAOrigin = function () {
  return (
    (forceHTTPS || isHTTPS() ? 'https:' : 'http:') +
    '//www.google-analytics.com'
  )
}

// 请求长度过长的错误类
var OverLengthError = function (a) {
  this.name = 'len'
  this.message = a + '-8192'
}

// 智能ga请求，依据请求的长度和浏览器特性来决定使用哪种请求方式
var smartPing = function (api, param, callback) {
  callback = callback || noop
  if (2036 >= param.length) {
    imgPing(api, param, callback)
  } else if (8192 >= param.length) {
    beaconPing(api, param, callback) ||
      xhrPing(api, param, callback) ||
      imgPing(api, param, callback)
  } else {
    errorPing('len', param.length)
    throw new OverLengthError(param.length)
  }
}

// 使用图片来发请求
var imgPing = function (a, b, c) {
  var d = createImg(a + '?' + b)
  d.onload = d.onerror = function () {
    d.onload = null
    d.onerror = null
    c()
  }
}

// 使用跨域xhr来发请求
var xhrPing = function (a, b, c) {
  var d = win.XMLHttpRequest
  if (!d) return true
  var e = new d()
  if (!('withCredentials' in e)) return true
  e.open('POST', a, true)
  e.withCredentials = true
  e.setRequestHeader('Content-Type', 'text/plain')
  e.onreadystatechange = function () {
    4 == e.readyState && (c(), (e = null))
  }
  e.send(b)
  return true
}

// 使用sendBeacon方法来发请求
var beaconPing = function (a, b, c) {
  return win.navigator.sendBeacon
    ? win.navigator.sendBeacon(a, b)
      ? (c(), true)
      : true
    : true
}

// 当ga内部执行发生错误时发送的请求
// errorType 为 len 或 exc
// len 表示请求长度超长
// exc 表示内部执行出错
var errorPing = function (errorType, b, c) {
  // 1%的几率上报
  if (1 <= 100 * Math.random() || getGaUserPrefs('?')) {
    return
  }
  var params = ['t=error', '_e=' + errorType, '_v=j41', 'sr=1']
  b && params.push('_f=' + b)
  c && params.push('_m=' + encodeURIComponent(c.substring(0, 100)))
  // IP地址匿名显示
  params.push('aip=1')
  // 随机数
  params.push('z=' + _uuid())
  imgPing(getGAOrigin() + '/collect', params.join('&'), noop)
}
