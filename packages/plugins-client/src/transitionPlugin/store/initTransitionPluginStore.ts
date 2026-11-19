import type { Scenes, Store } from 'churaverse-engine-client'
import type { TransitionManager } from '../transitionManager'
import type { TransitionPluginStore } from './defTransitionPluginStore'

export function initTransitionPluginStore<Scene extends Scenes>(
  store: Store<Scenes>,
  transitionManager: TransitionManager<Scene>
): void {
  const transitionPluginStore: TransitionPluginStore<Scenes> = {
    transitionManager,
  }

  store.setInit('transitionPlugin', transitionPluginStore)
}
