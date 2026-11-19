import type { IDialog } from '@churaverse/core-ui-plugin-client'
import type { GameSection } from '../ui/gameSection'

export interface IGameDialog extends IDialog<GameSection> {}

declare module '@churaverse/core-ui-plugin-client' {
  export interface DialogMap {
    game: IGameDialog
  }
}
