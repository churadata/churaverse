import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'
import { IPlayerListRender } from '../../../../domain/IRender/IPlayerListRender'
import { Player } from '../../../../domain/model/player'
import { PlayerListDialog } from './playerListDialog'

// playerList.htmlまでのパス
const PLAYER_LIST_PATH = 'assets/playerList.html'

// playerList.htmlのキー
const PLAYER_LIST_KEY = 'playerList'

// playerListのID
const PLAYER_LIST_ID = 'player-list'

// kickアイコンのimgまでのパス
const KICK_ICON_IMAGE_PATH = 'assets/exit.png'

export class PlayerList implements IPlayerListRender {
  private interactor?: Interactor
  private readonly playerListContainer: HTMLTableElement

  private constructor(scene: Scene, playerListDialog: PlayerListDialog) {
    const playerList = scene.add.dom(-370, 0).createFromCache(PLAYER_LIST_KEY).setOrigin(0, 0).setScrollFactor(0)
    this.playerListContainer = document.getElementById(PLAYER_LIST_ID) as HTMLTableElement

    if (this.playerListContainer == null) {
      throw new Error(`id:${PLAYER_LIST_ID}を持つelementが見つかりません。`)
    }
    playerListDialog.add(playerList)
  }

  public static async build(scene: Scene, playerListDialog: PlayerListDialog): Promise<PlayerList> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(PLAYER_LIST_KEY)) {
        resolve()
      }

      scene.load.html(PLAYER_LIST_KEY, PLAYER_LIST_PATH)

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new PlayerList(scene, playerListDialog)
    })
  }

  /**
   * プレイヤーの一覧用UIの作成
   */
  private createPlayerList(ownPlayerId: string, players: Map<string, Player>): void {
    players.forEach((player, id) => {
      const playerListElement = this.createPlayerListRow(player, id, ownPlayerId, players)
      this.playerListContainer.appendChild(playerListElement)
    })
  }

  /**
   * playerとkickボタンを持った行の作成
   */
  private createPlayerListRow(
    player: Player,
    playerId: string,
    ownPlayerId: string,
    players: Map<string, Player>
  ): HTMLTableRowElement {
    // playerListに追加する行の作成
    const newRow = document.createElement('tr')

    // newRowの要素となるplayer名表示用Cellの作成
    const playerNameCell = this.createPlayerNameCell(player)
    // newRowにplayer名表示Cellを追加
    newRow.appendChild(playerNameCell)

    // newRowの要素となるkickボタン用のCellの作成
    const kickCell = this.createKickButtonCell()
    // kickボタンの作成
    const kickButton = this.createKickButton(player, playerId)
    // kickCellにkickButtonを追加
    kickCell.appendChild(kickButton)

    const ownPlayer = players.get(ownPlayerId)
    // 自分の列の先頭に[自分]を追加
    if (ownPlayerId === playerId && playerNameCell.textContent !== null) {
      playerNameCell.textContent = '[自分]' + playerNameCell.textContent
    } else if (ownPlayerId !== playerId && ownPlayer !== undefined && this.hasKickPermission(ownPlayer)) {
      newRow.appendChild(kickCell)
    }

    return newRow
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
   * playerListの要素となるkickボタンを格納するCellを作成
   */
  private createKickButtonCell(): HTMLTableCellElement {
    // 新しいセルを作成して行に追加
    const kickButtonCell = document.createElement('td')
    kickButtonCell.style.textAlign = 'center'
    return kickButtonCell
  }

  /**
   * kickボタンの作成
   */
  private createKickButton(player: Player, playerId: string): HTMLElement {
    const button = document.createElement('img')
    button.src = KICK_ICON_IMAGE_PATH
    button.style.width = '20px'
    button.style.height = 'auto'
    button.addEventListener('pointerdown', () => {
      const isPlayerKicked = window.confirm(`「${player.name}」 を退出させますか？`)
      if (isPlayerKicked) {
        // kickする処理を実行、interactor経由で行う
        this.interactor?.requestKickPlayer(playerId)
      }
    })
    return button
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
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}
