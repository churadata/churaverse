import type { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client'
import type { IMainScene, Store } from 'churaverse-engine-client'
import type { IPlayerListUi } from './interface/IPlayerListUi'
import { PlayerList } from './playerListDialog/playerList'
import { PlayerListDialog } from './playerListDialog/playerListDialog'
import { PlayerListIcon } from './playerListDialog/playerListIcon'

export class PlayerListUi implements IPlayerListUi {
  public playerListDialog: PlayerListDialog
  public playerListIcon: TopBarIconRenderer
  public playerList: PlayerList
  public constructor(store: Store<IMainScene>) {
    this.playerListDialog = new PlayerListDialog()
    const coreUiPluginStore = store.of('coreUiPlugin')
    this.playerListIcon = new PlayerListIcon(
      coreUiPluginStore.switcher,
      this.playerListDialog,
      coreUiPluginStore.topBarIconContainer
    )

    this.playerList = new PlayerList(this.playerListDialog)
  }
}
