import { Dialog } from '@churaverse/core-ui-plugin-client'
import type { IGameDialog } from '../interface/IGameDialog'
import type { GameSection } from './gameSection'

export class GameDialog extends Dialog<GameSection> implements IGameDialog {
  public constructor() {
    const props = {
      dialogName: 'ゲーム',
    }
    super(props)
  }

  public static build(): Dialog<GameSection> {
    return new GameDialog()
  }
}

export interface GameDialogSectionMap {
  game: GameSection
}
