import { saveGlobalConfig } from './store'
import { beforeRouteEnter } from './lifecycle'
import bindEvent from './effects/bindEvent'

export function init(config: GlobalConfig) {
  saveGlobalConfig(config)
  beforeRouteEnter()
  bindEvent()
}
