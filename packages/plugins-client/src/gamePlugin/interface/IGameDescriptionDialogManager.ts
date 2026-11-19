import type { GameIds } from '../interface/gameIds'
import type { GameDescriptionDialogType, IGameDescriptionDialog } from './IGameDescriptionDialog'

export interface IGameDescriptionDialogManager {
  add: (gameId: GameIds, dialog: IGameDescriptionDialog) => void
  showDialog: (gameId: GameIds, type: GameDescriptionDialogType) => void
  closeDialog: () => void
}
