import type { Player, PlayersRepository } from '@churaverse/player-plugin-client'
import { DomManager } from 'churaverse-engine-client'
import type { IPlayerListRenderer } from '../interface/IPlayerListRenderer'
import { PlayerListDialogPanel } from './components/PlayerListDialogPanel'
import { PlayerListItemComponent } from './components/PlayerListItemComponent'
import type { PlayerListDialog } from './playerListDialog'

/**
 * PlayerListのプレイヤー名の横に表示する要素を返す関数
 */
export type PlayerListRowContentCreator = (playerId: string) => HTMLElement

// playerListのID
export const PLAYER_LIST_ID = 'player-list'
export const PLAYER_COUNTER_ID = 'player-counter'

/**
 * addElementToEachRowで追加される要素の親要素が持つクラス名
 */
export const ROW_CONTENT_CONTAINER_CLASS_NAME = 'player-list-row-content-container'

export class PlayerList implements IPlayerListRenderer {
  private readonly playerListContainer: HTMLElement
  private readonly playerCounter: HTMLElement
  private readonly rowContentCreators: PlayerListRowContentCreator[] = []

  public constructor(playerListDialog: PlayerListDialog) {
    playerListDialog.directlyAddContent(DomManager.addJsxDom(PlayerListDialogPanel()))

    this.playerListContainer = DomManager.getElementById(PLAYER_LIST_ID)
    this.playerCounter = DomManager.getElementById(PLAYER_COUNTER_ID)
  }

  /**
   * プレイヤーの一覧用UIの作成
   */
  private createPlayerList(ownPlayerId: string, players: PlayersRepository): void {
    players.getAllId().forEach((id) => {
      const player = players.get(id)
      if (player === undefined) return

      const rowContents = this.rowContentCreators.map((creator) => {
        return creator(id)
      })

      const playerListElement = this.createPlayerListRow(player, id, ownPlayerId, rowContents)
      this.playerListContainer.appendChild(playerListElement)
    })
  }

  /**
   * プレイヤーの一覧用UIの人数部分の作成
   */
  private createPlayerCount(players: PlayersRepository): HTMLElement {
    const count = document.createElement('span')
    const playerCount = players.getAllId().length
    count.textContent = `人数：${playerCount}`

    return count
  }

  /**
   * 引数で受け取ったplayerの行を作成
   */
  private createPlayerListRow(
    player: Player,
    playerId: string,
    ownPlayerId: string,
    rowContents: HTMLElement[]
  ): HTMLElement {
    const playerName = (ownPlayerId === playerId ? '[自分]' : '') + player.name
    const row = DomManager.jsxToDom(PlayerListItemComponent({ playerName }))
    const contentsContainer = row.getElementsByClassName(ROW_CONTENT_CONTAINER_CLASS_NAME)[0] as HTMLDivElement
    rowContents.forEach((content) => {
      contentsContainer.appendChild(content)
    })

    return row
  }

  /**
   * playerが名前変更＆入退出時に実行
   */
  public updatePlayerList(ownPlayerId: string, players: PlayersRepository): void {
    this.playerListContainer.innerHTML = ''
    this.createPlayerList(ownPlayerId, players)
    this.updatePlayerCount(players)
  }

  /**
   * playerの人数が増減した時に実行
   */
  private updatePlayerCount(players: PlayersRepository): void {
    this.playerCounter.innerHTML = ''
    const count = this.createPlayerCount(players)
    this.playerCounter.appendChild(count)
  }

  public addRowContentCreator(rowContentCreator: PlayerListRowContentCreator): void {
    this.rowContentCreators.push(rowContentCreator)
  }
}
