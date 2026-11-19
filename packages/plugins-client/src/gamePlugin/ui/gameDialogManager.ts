import type { IMainScene, Store } from 'churaverse-engine-client'
import type { IGameDialog } from '../interface/IGameDialog'
import type { IGameSelectionListContainer } from '../interface/IGameSelectionListContainer'
import { GameDialog } from './gameDialog'
import { GameIcon } from './gameIcon'
import { GameSection } from './gameSection'

export class GameDialogManager {
  private readonly gameIcon: GameIcon
  private readonly gameDialog: IGameDialog

  public constructor(store: Store<IMainScene>) {
    this.gameDialog = new GameDialog()
    this.gameDialog.addSection(new GameSection('game', 'ゲーム一覧'))
    const coreUiPluginStore = store.of('coreUiPlugin')
    this.gameIcon = new GameIcon(coreUiPluginStore.switcher, this.gameDialog, coreUiPluginStore.topBarIconContainer)
  }

  public init(container: IGameSelectionListContainer): void {
    this.gameDialog.addContent('game', container.node)
  }

  public closeGameDialog(): void {
    this.gameIcon.close()
  }
}
