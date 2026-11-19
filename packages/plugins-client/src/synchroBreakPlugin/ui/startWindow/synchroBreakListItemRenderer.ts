import type { GamePolicy, IGameSelectionListContainer } from '@churaverse/game-plugin-client'
import { GameSelectionListItemRenderer } from '@churaverse/game-plugin-client'
import type { IMainScene, Store } from 'churaverse-engine-client'
import SYNCHRO_BREAK_ICON_PATH from '../../assets/synchroBreakIcon.png'

export class SynchroBreakListItemRenderer extends GameSelectionListItemRenderer {
  public constructor(
    store: Store<IMainScene>,
    gamePolicy: GamePolicy,
    gameListContainer: IGameSelectionListContainer,
    imagePath: string = SYNCHRO_BREAK_ICON_PATH
  ) {
    super(store, gamePolicy, {
      imagePath,
      gameId: 'synchroBreak',
      gameName: 'シンクロブレイク',
      order: 10,
    })
    gameListContainer.addGame(this)
  }
}
