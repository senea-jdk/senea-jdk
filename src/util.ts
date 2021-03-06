export const noob = function () {}

export function throwError(message: string) {
  throw new Error(message)
}

export function warn(...args: any[]) {
  args.unshift('[senea] ')
  console.warn(...args)
}

export function isFunction(argv: any) {
  return typeof argv === 'function'
}

export function isObject(argv: any) {
  return Object.prototype.toString.call(argv) === '[object Object]'
}

export function isString(argv: any) {
  return typeof argv === 'string'
}

export function isArray(argv: any): argv is [] {
  return Object.prototype.toString.call(argv) === '[object Array]'
}

export function randomString(length = 6) {
  const temp = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += temp.charAt(Math.floor(Math.random() * temp.length))
  }
  return result
}

export const getUuid = (a: string = ''): string =>
  a
    ? /* eslint-disable no-bitwise */
      ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
    : `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, getUuid)

export function getBrowser() {
  var userAgent = navigator.userAgent
  var isOpera = userAgent.indexOf('Opera') > -1
  var isIE =
    userAgent.indexOf('compatible') > -1 &&
    userAgent.indexOf('MSIE') > -1 &&
    !isOpera
  var isEdge = userAgent.indexOf('Edge') > -1
  var isFF = userAgent.indexOf('Firefox') > -1
  var isSafari =
    userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1
  var isChrome =
    userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1

  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    var fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion == 7) {
      return 'IE7'
    } else if (fIEVersion == 8) {
      return 'IE8'
    } else if (fIEVersion == 9) {
      return 'IE9'
    } else if (fIEVersion == 10) {
      return 'IE10'
    } else if (fIEVersion == 11) {
      return 'IE11'
    } else {
      return 'IE'
    }
  }
  if (isOpera) {
    return 'Opera'
  }
  if (isEdge) {
    return 'Edge'
  }
  if (isFF) {
    return 'FF'
  }
  if (isSafari) {
    return 'Safari'
  }
  if (isChrome) {
    return 'Chrome'
  }
  return 'unknown'
}

export function getOS() {
  let ua = navigator.userAgent.toLowerCase()
  let os = 'unknown'
  if (ua.indexOf('win') > -1) {
    os = 'Windows'
    if (ua.indexOf('windows nt 5.0') > -1) {
      os = 'Windows 2000'
    } else if (
      ua.indexOf('windows nt 5.1') > -1 ||
      ua.indexOf('windows nt 5.2') > -1
    ) {
      os = 'Windows XP'
    } else if (ua.indexOf('windows nt 6.0') > -1) {
      os = 'Windows Vista'
    } else if (
      ua.indexOf('windows nt 6.1') > -1 ||
      ua.indexOf('windows 7') > -1
    ) {
      os = 'Windows 7'
    } else if (
      ua.indexOf('windows nt 6.2') > -1 ||
      ua.indexOf('windows 8') > -1
    ) {
      os = 'Windows 8'
    } else if (ua.indexOf('windows nt 6.3') > -1) {
      os = 'Windows 8.1'
    } else if (
      ua.indexOf('windows nt 6.2') > -1 ||
      ua.indexOf('windows nt 10.0') > -1
    ) {
      os = 'Windows 10'
    } else {
      os = 'unknown'
    }
  } else if (ua.indexOf('iphone') > -1) {
    os = 'Iphone'
  } else if (ua.indexOf('mac') > -1) {
    os = 'Mac'
  } else if (
    ua.indexOf('x11') > -1 ||
    ua.indexOf('unix') > -1 ||
    ua.indexOf('sunname') > -1 ||
    ua.indexOf('bsd') > -1
  ) {
    os = 'Unix'
  } else if (ua.indexOf('linux') > -1) {
    if (ua.indexOf('android') > -1) {
      os = 'Android'
    } else {
      os = 'Linux'
    }
  } else {
    os = 'unknown'
  }
  return os
}
