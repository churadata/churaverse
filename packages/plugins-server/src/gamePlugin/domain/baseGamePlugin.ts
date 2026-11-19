import { BasePlugin, EVENT_PRIORITY, type IMainScene } from 'churaverse-engine-server'
import type { GameAbortEvent } from '../event/gameAbortEvent'
import type { GameEndEvent } from '../event/gameEndEvent'
import type { GameStartEvent } from '../event/gameStartEvent'
import type { GameIds } from '../interface/gameIds'
import type { GamePluginStore } from '../store/defGamePluginStore'

/**
 * 全てのゲームプラグインの基本となる抽象クラス
 */
export abstract class BaseGamePlugin extends BasePlugin<IMainScene> {
  public abstract gameId: GameIds
  protected gamePluginStore!: GamePluginStore

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.getStores.bind(this))
    this.bus.subscribeEvent('gameStart', this.setupSubscribeGameEvent, EVENT_PRIORITY.HIGH)
    this.bus.subscribeEvent('gameStart', this.setupHandleGameStart)
  }

  /**
   * ゲーム開始時に共通して登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    this.bus.subscribeEvent('gameEnd', this.onGameTerminate)
    this.bus.subscribeEvent('gameAbort', this.onGameTerminate)
  }

  /**
   * ゲーム中断・終了時に共通して削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    this.bus.unsubscribeEvent('gameEnd', this.onGameTerminate)
    this.bus.unsubscribeEvent('gameAbort', this.onGameTerminate)
  }

  private getStores(): void {
    this.gamePluginStore = this.store.of('gamePlugin')
  }

  protected get isActive(): boolean {
    return this.gamePluginStore.games.get(this.gameId)?.isActive ?? false
  }

  private readonly setupSubscribeGameEvent = (_ev: GameStartEvent): void => {
    if (!this.isActive) return
    this.subscribeGameEvent()
  }

  private readonly setupHandleGameStart = (_ev: GameStartEvent): void => {
    if (!this.isActive) return
    this.handleGameStart()
  }

  private readonly onGameTerminate = (ev: GameAbortEvent | GameEndEvent): void => {
    if (ev.gameId !== this.gameId) return
    this.unsubscribeGameEvent()
    this.handleGameTermination()
  }

  /**
   * ゲーム特有の開始時の処理を実装するための抽象メソッド
   * 各ゲームプラグインでオーバーライドし、具体的な処理を定義する
   */
  protected abstract handleGameStart(): void

  /**
   * ゲームの終了・中断時の処理を実装するための抽象メソッド。
   * 各ゲームプラグインでオーバーライドし、具体的な処理を定義する。
   */
  protected abstract handleGameTermination(): void
}
