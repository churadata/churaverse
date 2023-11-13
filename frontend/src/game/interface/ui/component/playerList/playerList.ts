import { Interactor } from '../../../../interactor/Interactor'
import { IPlayerListRender } from '../../../../domain/IRender/IPlayerListRender'
import { Player } from '../../../../domain/model/player'
import { PlayerListItemComponent } from './components/PlayerListItemComponent'
import { DomManager } from '../../util/domManager'
import { PlayerListDialog } from './playerListDialog'
import { PlayerListDialogPanel } from './components/PlayerListDialogPanel'

// playerListのID
export const PLAYER_LIST_ID = 'player-list'
export const PLAYER_COUNTER_ID = 'player-counter'

export class PlayerList implements IPlayerListRender {
  private interactor?: Interactor
  private readonly playerListContainer: HTMLElement
  private readonly playerCounter: HTMLElement

  private constructor(playerListDialog: PlayerListDialog) {
    playerListDialog.directlyAddContent(DomManager.addJsxDom(PlayerListDialogPanel()))

    this.playerListContainer = DomManager.getElementById(PLAYER_LIST_ID)
    this.playerCounter = DomManager.getElementById(PLAYER_COUNTER_ID)

    if (this.playerListContainer == null) {
      throw new Error(`id:${PLAYER_LIST_ID}を持つelementが見つかりません。`)
    }
  }

  public static async build(playerListDialog: PlayerListDialog): Promise<PlayerList> {
    return new PlayerList(playerListDialog)
  }

  /**
   * プレイヤーの一覧用UIの作成
   */
  private createPlayerList(ownPlayerId: string, players: Map<string, Player>): void {
    const userPermit = players.get(ownPlayerId)?.role === 'admin'
    players.forEach((player, id) => {
      const playerListElement = this.createPlayerListRow(player, id, ownPlayerId, players)
      this.playerListContainer.appendChild(playerListElement)
      const hasKickButton = userPermit && ownPlayerId !== id
      if (hasKickButton) {
        this.attachKickButton(player, id, hasKickButton)
      }
    })
  }

  /**
   * プレイヤーの一覧用UIの人数部分の作成
   */
  private createPlayerCount(players: Map<string, Player>): HTMLElement {
    const count = document.createElement('span')
    const playerCount = players.size
    count.textContent = `人数：${playerCount}`

    return count
  }

  /**
   * playerとkickボタンを持った行の作成
   */
  private createPlayerListRow(
    player: Player,
    playerId: string,
    ownPlayerId: string,
    players: Map<string, Player>
  ): HTMLElement {
    const ownPlayer = players.get(ownPlayerId)

    const playerName = (ownPlayerId === playerId ? '[自分]' : '') + player.name
    const hasPermissionToKick =
      ownPlayer != null ? this.hasKickPermission(ownPlayer) && ownPlayerId !== playerId : false
    const itemElement = PlayerListItemComponent({
      playerName,
      hasPermissionToKick,
      itemId: this.playerKickButtonId(playerId),
    })

    return DomManager.jsxToDom(itemElement)
  }

  /**
   * playerListの要素となるplayer要素を作成
   */
  private createPlayerNameCell(player: Player): HTMLTableCellElement {
    // 新しいセルを作成して行に追加
    const eventCell = document.createElement('td')
    eventCell.textContent = player.name
    eventCell.style.textAlign = 'left'
    eventCell.style.whiteSpace = 'nowrap'
    eventCell.style.overflow = 'hidden'
    eventCell.style.textOverflow = 'ellipsis'
    eventCell.style.whiteSpace = 'nowrap'
    return eventCell
  }

  /**
   * kickボタンのIDを作成
   */
  private playerKickButtonId(playerId: string): string {
    return `playerKickButton_${playerId}`
  }

  /**
   * kickボタンの作成
   */
  private attachKickButton(player: Player, playerId: string, hasPermissionToKick: boolean): void {
    if (!hasPermissionToKick) return
    const playerKickButtonId = this.playerKickButtonId(playerId)
    const kickButton = DomManager.getElementById(playerKickButtonId)
    if (kickButton == null) {
      throw new Error(`id:${playerKickButtonId}を持つelementが見つかりません。`)
    }
    kickButton.addEventListener('pointerdown', () => {
      const isPlayerKicked = window.confirm(`「${player.name}」 を退出させますか？`)
      if (isPlayerKicked) {
        // kickする処理を実行、interactor経由で行う
        this.interactor?.requestKickPlayer(playerId)
      }
    })
  }

  private hasKickPermission(player: Player): boolean {
    if (player.role === 'admin') {
      return true
    } else {
      return false
    }
  }

  /**
   * playerが名前変更＆入退出時に実行
   */
  public updatePlayerList(ownPlayerId: string, players: Map<string, Player>): void {
    this.playerListContainer.innerHTML = ''
    this.createPlayerList(ownPlayerId, players)
    this.updatePlayerCount(players)
  }

  /**
   * playerの人数が増減した時に実行
   */
  private updatePlayerCount(players: Map<string, Player>): void {
    this.playerCounter.innerHTML = ''
    const count = this.createPlayerCount(players)
    this.playerCounter.appendChild(count)
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}
