import { BasePlugin, type IMainScene } from 'churaverse-engine-client'
import type { GameAbortEvent } from '../event/gameAbortEvent'
import type { GameEndEvent } from '../event/gameEndEvent'
import type { GameMidwayJoinEvent } from '../event/gameMidwayJoinEvent'
import type { GameStartEvent } from '../event/gameStartEvent'
import type { SubmitGameJoinEvent } from '../event/submitGameJoinEvent'
import type { GameIds } from '../interface/gameIds'
import type { GameInfoStore } from '../store/defGamePluginStore'

/**
 * 全てのゲームプラグインの基本となる抽象クラス
 */
export abstract class BaseGamePlugin extends BasePlugin<IMainScene> {
  public abstract gameId: GameIds
  protected gameInfoStore!: GameInfoStore

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.getStores.bind(this))
    this.bus.subscribeEvent('submitGameJoin', this.onSubmitGameJoin.bind(this))
    this.bus.subscribeEvent('gameMidwayJoin', this.onGameMidwayJoin.bind(this))
  }

  private getStores(): void {
    this.gameInfoStore = this.store.of('gameInfo')
  }

  /**
   * ゲーム開始時に共通して登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    this.bus.subscribeEvent('gameStart', this.onGameStart)
    this.bus.subscribeEvent('gameAbort', this.onGameTerminate)
    this.bus.subscribeEvent('gameEnd', this.onGameTerminate)
  }

  /**
   * ゲーム中断・終了時に共通して削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    this.bus.unsubscribeEvent('gameStart', this.onGameStart)
    this.bus.unsubscribeEvent('gameAbort', this.onGameTerminate)
    this.bus.unsubscribeEvent('gameEnd', this.onGameTerminate)
  }

  protected get isActive(): boolean {
    return this.gameInfoStore.games.get(this.gameId)?.isActive ?? false
  }

  private onSubmitGameJoin(ev: SubmitGameJoinEvent): void {
    if (!this.isActive || !ev.willJoin) return
    this.subscribeGameEvent()
  }

  private readonly onGameStart = (_ev: GameStartEvent): void => {
    if (!this.isActive) return
    this.handleGameStart()
  }

  private readonly onGameTerminate = (ev: GameAbortEvent | GameEndEvent): void => {
    if (ev.gameId !== this.gameId) return
    this.unsubscribeGameEvent()
    this.handleGameTermination()
  }

  private onGameMidwayJoin(ev: GameMidwayJoinEvent): void {
    if (!this.isActive) return
    if (this.store.of('playerPlugin').ownPlayerId !== ev.joinPlayerId) return
    this.subscribeGameEvent()
    this.handleMidwayJoin()
  }

  /**
   * ゲーム特有の開始時の処理を実装するための抽象メソッド
   * - ゲームに参加している全プレイヤーに対して共通で実行される
   */
  protected abstract handleGameStart(): void

  /**
   * ゲームの終了・中断時の処理を実装するための抽象メソッド。
   * - ゲームに参加している全プレイヤーに対して共通で実行される
   */
  protected abstract handleGameTermination(): void

  /**
   * ゲーム特有の途中参加時の処理を実装するための抽象メソッド
   * - 途中参加したプレイヤーにのみ実行される
   */
  protected abstract handleMidwayJoin(): void
}
