import { beforeRouteLeave } from '../lifecycle'
import { saveUserBehavior, saveError } from '../store'
import { isWatchedUrl } from '../util'

export function handleRouteLeave() {
  beforeRouteLeave()
}

export function handleError(e: Event) {
  if (isWatchedUrl() && e.isTrusted) {
    if (e instanceof ErrorEvent) {
      saveError({
        type: e.type,
        timeStamp: e.timeStamp,
        message: e.error.message,
        stack: e.error.stack,
        lineno: e.lineno,
        colno: e.colno
      })
    } else if (e instanceof Event) {
      const target = e.target
      if (target instanceof Element) {
        saveError({
          type: e.type,
          timeStamp: e.timeStamp,
          message: 'network error in ' + target?.outerHTML,
          stack: '',
          lineno: 0,
          colno: 0
        })
      } else {
        saveError({
          type: e.type,
          timeStamp: e.timeStamp,
          message: 'unknown error',
          stack: '',
          lineno: 0,
          colno: 0
        })
      }
    }
  }
}

export function handleRejection(e: PromiseRejectionEvent) {
  if (isWatchedUrl() && e.isTrusted) {
    saveError({
      type: e.type,
      timeStamp: e.timeStamp,
      message: e.reason,
      stack: '',
      lineno: 0,
      colno: 0
    })
  }
}

export function handleBehaviorClick(e: MouseEvent) {
  if (isWatchedUrl() && e.isTrusted) {
    const target = e.target
    if (target instanceof Element) {
      saveUserBehavior({
        type: 'click',
        step: 1,
        target: target.nodeName,
        offsetx: target.clientLeft,
        offsety: target.clientTop
      })
    }
  }
}
