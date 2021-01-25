import { GlobalConfig, behaviors, updateStayTime } from './store'
import { handleNavPerf, handleResourcePerf } from './effects/handler'

export function pageWillMount() {
  performance.mark('load')
  behaviors.push({
    type: 'navigation',
    step: 0,
    target: '',
    offsetx: 0,
    offsety: 0
  })
}

export function pageDidMounted() {
  const config = GlobalConfig.current
  if (config.openPerf) {
    handleNavPerf()
    handleResourcePerf(config.resourceTimeout)
  }
}

export function pageWillUnmounted() {
  performance.mark('unload')
  performance.measure('staytime', 'load', 'unload')
  const staytime = performance.getEntriesByName('staytime')
  updateStayTime(staytime[0].duration)
  performance.clearMarks()
  performance.clearMeasures()
}
