import { GameDescriptionDialog } from '@churaverse/game-plugin-client'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'

export class PopupSynchroBreakRule extends GameDescriptionDialog {
  public constructor(bus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(bus, store, 'synchroBreak', 'シンクロブレイク')
  }
}
