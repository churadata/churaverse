import type { IDialog } from '@churaverse/core-ui-plugin-client'
import type { PlayerListSection } from '../playerListDialog/playerListSection'
import '@churaverse/core-ui-plugin-client'

export interface IPlayerListDialog extends IDialog<PlayerListSection> {}

declare module '@churaverse/core-ui-plugin-client' {
  export interface DialogMap {
    playerList: IPlayerListDialog
  }
}
