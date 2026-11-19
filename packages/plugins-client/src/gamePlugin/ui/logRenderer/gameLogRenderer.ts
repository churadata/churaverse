import type { IMainScene, Store } from 'churaverse-engine-client'
import '@churaverse/core-ui-plugin-client'
import '@churaverse/player-plugin-client'
import type { Player } from '@churaverse/player-plugin-client'
import { PlayerNotExistsInPlayerRepositoryError } from '@churaverse/player-plugin-client'
import type { IGameLogRenderer } from '../../interface/IGameLogRenderer'

export class GameLogRenderer implements IGameLogRenderer {
  public constructor(private readonly store: Store<IMainScene>) {}

  /**
   * ゲームが開始のログを表示
   * @param gameName ゲーム名
   * @param playerId ゲームを開始したプレイヤーid
   */
  public gameStartLog(gameName: string, playerId: string): void {
    const playerName = this.getPlayerName(playerId)
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(`${playerName}さんが、${gameName}を開始しました`)
  }

  /**
   * ゲームが中断のログを表示
   * @param gameName ゲーム名
   * @param playerId ゲームを中断したプレイヤーid
   */
  public gameAbortLog(gameName: string, playerId: string): void {
    const playerName = this.getPlayerName(playerId)
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(`${playerName}さんが、${gameName}を中断しました`)
  }

  /**
   * ゲームが終了のログを表示
   * @param gameName ゲーム名
   */
  public gameEndLog(gameName: string): void {
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(`${gameName}が終了しました`)
  }

  /**
   * ゲーム関係のログを表示
   * @param message ログメッセージ
   * @param x ログを表示するx座標
   */
  public gameLog(message: string, x: number): void {
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(message, x)
  }

  /**
   * ゲームに途中参加したプレイヤーのログを表示
   * @param gameName
   */
  public gameMidwayJoinLog(gameName: string, joinPlayerId: string): void {
    const playerName = this.getPlayerName(joinPlayerId)
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(`${playerName}さんが、${gameName}に途中参加しました`)
  }

  /**
   * プレイヤーidからプレイヤー名を取得
   */
  private getPlayerName(playerId: string): string {
    const player: Player | undefined = this.store.of('playerPlugin').players.get(playerId)
    if (player === undefined) {
      throw new PlayerNotExistsInPlayerRepositoryError(playerId)
    }
    return player.name
  }
}
