import { getBrowser, getOS } from '../util'

export let defaultTracker: Tracker

export function createTracker(opts: CreateTrackerOption) {
  const newTracker = new Tracker(
    Object.assign(generateDefaultTrackerOption(), opts)
  )
  defaultTracker = newTracker
}

class Tracker {
  private fields: Record<string, any> = {}

  constructor(opts: CreateTrackerOption) {
    Object.entries(opts).forEach((opt) => {
      this.setField(opt[0], opt[1])
    })
  }

  setField(fieldName: string, fieldValue: any) {
    this.fields[fieldName] = fieldValue
  }

  getField(fieldName: string) {
    return this.fields[fieldName]
  }

  send(hitType: string, param: any) {
    const fields = this.fields
    const url = `${fields.isHTTPS ? 'https' : 'http'}://${
      fields.origin
    }/${hitType}`
    smartPing(url, JSON.stringify(param))
  }
}

function generateDefaultTrackerOption() {
  const option = {
    isHTTPS: true,
    origin: 'www.senea-analytics.com',
    transport: 'image',
    clientId: '',
    browser: getBrowser(),
    os: getOS()
  }
  return option
}
