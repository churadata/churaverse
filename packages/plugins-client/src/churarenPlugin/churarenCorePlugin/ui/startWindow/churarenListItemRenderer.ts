import type { GamePolicy, IGameSelectionListContainer } from '@churaverse/game-plugin-client'
import { GameSelectionListItemRenderer } from '@churaverse/game-plugin-client'
import type { IMainScene, Store } from 'churaverse-engine-client'
import CHURAREN_ICON_PATH from '../../assets/churarenIcon.png'
import { CHURAREN_CONSTANTS } from '../../constants/churarenConstants'

export class ChurarenListItemRenderer extends GameSelectionListItemRenderer {
  public constructor(
    store: Store<IMainScene>,
    gamePolicy: GamePolicy,
    gameListContainer: IGameSelectionListContainer,
    imagePath: string = CHURAREN_ICON_PATH
  ) {
    super(store, gamePolicy, {
      imagePath,
      gameId: CHURAREN_CONSTANTS.GAME_ID,
      gameName: CHURAREN_CONSTANTS.GAME_NAME,
      order: 20,
    })
    gameListContainer.addGame(this)
  }
}
