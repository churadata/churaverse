import type { PlayersRepository } from '@churaverse/player-plugin-client'
import type { PlayerListRowContentCreator } from '../playerListDialog/playerList'

export interface IPlayerListRenderer {
  updatePlayerList: (ownPlayerId: string, players: PlayersRepository) => void

  /**
   * 各行に要素を追加するcallbackを追加する. 引数に渡したrowContentCreatorの戻り値が各行に要素として追加される.
   * @param rowContentCreator 追加する要素を返す関数. 引数には追加する行のplayerIdが渡される
   */
  addRowContentCreator: (rowContentCreator: PlayerListRowContentCreator) => void
}
