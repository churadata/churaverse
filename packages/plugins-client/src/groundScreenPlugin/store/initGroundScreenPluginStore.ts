import type { IMainScene, Store } from 'churaverse-engine-client'
import type { GroundScreenRendererFactory } from '../renderer/groundScreenRendererFactory'
import type { GroundScreenPluginStore } from './defGroundScreenPluginStore'

export function initGroundScreenPluginStore(
  store: Store<IMainScene>,
  groundScreenRendererFactory: GroundScreenRendererFactory
): void {
  const groundScreenPluginStore: GroundScreenPluginStore = {
    groundScreenRendererFactory,
  }

  store.setInit('groundScreenPlugin', groundScreenPluginStore)
}
