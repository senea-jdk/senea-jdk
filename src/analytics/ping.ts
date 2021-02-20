import { warn, noob } from '../util'

// 智能ga请求，依据请求的长度和浏览器特性来决定使用哪种请求方式
export const smartPing = function (
  api: string,
  param: string,
  callback = noob
) {
  if (param.length <= 2036) {
    imgPing(api, param, callback)
  } else if (param.length <= 8192) {
    beaconPing(api, param, callback) ||
      xhrPing(api, param, callback) ||
      imgPing(api, param, callback)
  } else {
    warn('监控数据长度超过8192，取消推送！')
  }
}

// 使用图片来发请求
export const imgPing = function (
  api: string,
  param: string,
  callback: Function
) {
  const img = createImg(api + '?' + param)
  img.onload = img.onerror = function () {
    img.onload = null
    img.onerror = null
    callback()
  }
}

// 使用跨域xhr来发请求
export const xhrPing = function (
  api: string,
  param: string,
  callback: Function
) {
  const _XMLHttpRequest = window.XMLHttpRequest
  if (!_XMLHttpRequest) return true
  let xhr = new _XMLHttpRequest()
  if (!('withCredentials' in xhr)) return true
  xhr.open('POST', api, true)
  xhr.withCredentials = true
  xhr.setRequestHeader('Content-Type', 'text/plain')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      callback()
      if (xhr.status >= 200 && xhr.status <= 299) {
        warn('监控数据推送成功！')
      } else {
        warn('监控数据推送失败！')
      }
    }
  }
  xhr.send(param)
  return true
}

// 使用sendBeacon方法来发请求
export const beaconPing = function (
  api: string,
  param: string,
  callback: Function
) {
  if (typeof window.navigator.sendBeacon === 'function') {
    return window.navigator.sendBeacon(api, param) && (callback(), true)
  } else {
    warn('navigator.sendBeacon not supported')
    return false
  }
}

const createImg = function (src: string) {
  const img = document.createElement('img')
  img.width = 1
  img.height = 1
  img.src = src
  return img
}
