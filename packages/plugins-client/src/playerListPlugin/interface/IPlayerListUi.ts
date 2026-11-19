import type { ITopBarIconRenderer } from '@churaverse/core-ui-plugin-client'
import type { IPlayerListDialog } from './IPlayerListDialog'
import type { IPlayerListRenderer } from './IPlayerListRenderer'

export interface IPlayerListUi {
  playerListDialog: IPlayerListDialog
  playerListIcon: ITopBarIconRenderer
  playerList: IPlayerListRenderer
}
