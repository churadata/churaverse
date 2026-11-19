import type { IMainScene, Store } from 'churaverse-engine-client'
import { GhostModeIcon } from './ghostModeIcon'
import '@churaverse/core-ui-plugin-client'

export class GhostModeIndicatorUi {
  public readonly ghostModeIcon: GhostModeIcon

  public constructor(store: Store<IMainScene>) {
    const topBarIconContainer = store.of('coreUiPlugin').topBarIconContainer
    this.ghostModeIcon = new GhostModeIcon(topBarIconContainer)
  }
}
