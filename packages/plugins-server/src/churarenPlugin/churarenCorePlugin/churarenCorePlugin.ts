import type { GamePolicy } from '@churaverse/game-plugin-server'
import { CoreGamePlugin, GameEndEvent, GamePlayerQuitEvent } from '@churaverse/game-plugin-server'
import type { NetworkPluginStore } from '@churaverse/network-plugin-server'
import { isPlayer } from '@churaverse/player-plugin-server'
import { EVENT_PRIORITY, type IMainScene, type LivingDamageEvent } from 'churaverse-engine-server'
import { CHURAREN_CONSTANTS } from './constants/churarenConstants'
import { SocketController } from './controller/socketController'
import type { ChurarenResultEvent } from './event/churarenResultEvent'
import { ChurarenResultMessage } from './message/churarenResultMessage'
import { ChurarenStartCountdownMessage } from './message/churarenStartCountdownMessage'
import { ChurarenStartTimerMessage } from './message/churarenStartTimerMessage'
import { initChurarenPluginStore } from './store/churarenPluginStoreManager'
import { isWeaponDamageCause } from './utils/isWeaponDamageCause'

const RESULT_DISPLAY_TIME_SECONDS = 15 // 結果表示時間(sec)

export class ChurarenCorePlugin extends CoreGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private socketController?: SocketController
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  public readonly gamePolicy: GamePolicy = {
    allowMidwayJoin: false,
  }
  private resultDisplayTimeoutId: ReturnType<typeof setTimeout> | undefined

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('start', this.start.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
  }

  /**
   * ゲームが開始された時に登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('churarenStartCountdown', this.sendStartCountdown)
    this.bus.subscribeEvent('churarenStartTimer', this.sendStartTimer)
    this.bus.subscribeEvent('churarenResult', this.sendChurarenResult)
    this.bus.subscribeEvent('livingDamage', this.skipChuraverseDamage, EVENT_PRIORITY.HIGH)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('churarenStartCountdown', this.sendStartCountdown)
    this.bus.unsubscribeEvent('churarenStartTimer', this.sendStartTimer)
    this.bus.unsubscribeEvent('churarenResult', this.sendChurarenResult)
    this.bus.unsubscribeEvent('livingDamage', this.skipChuraverseDamage)
  }

  private start(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  /**
   * ゲームが開始された時の処理
   */
  protected handleGameStart(): void {
    initChurarenPluginStore(this.gameId, this.store, this.bus)
    this.sequence().catch((err) => {
      console.error(err)
      this.bus.post(new GameEndEvent(this.gameId))
    })
  }

  /**
   * 中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    clearTimeout(this.resultDisplayTimeoutId)
    this.resultDisplayTimeoutId = undefined
    this.store.deleteStoreOf('churarenPlugin')
  }

  protected handlePlayerLeave(playerId: string): void {
    if (playerId === this.gameOwnerId || this.joinedPlayerIds.length <= 0) {
      this.bus.post(new GameEndEvent(this.gameId))
    } else {
      if (!this.isActive) return
      this.bus.post(new GamePlayerQuitEvent(this.gameId, playerId))
    }
  }

  protected handlePlayerQuitGame(_playerId: string): void {
    if (this.joinedPlayerIds.length <= 0) {
      this.bus.post(new GameEndEvent(this.gameId))
    }
  }

  private readonly sendStartCountdown = (): void => {
    this.networkPluginStore.messageSender.send(new ChurarenStartCountdownMessage())
  }

  private readonly sendStartTimer = (): void => {
    this.networkPluginStore.messageSender.send(new ChurarenStartTimerMessage())
  }

  /**
   * 結果を表示する処理
   * `RESULT_DISPLAY_TIME_SECONDS`秒後にゲームを終了する
   */
  private readonly sendChurarenResult = (ev: ChurarenResultEvent): void => {
    this.networkPluginStore.messageSender.send(new ChurarenResultMessage({ resultType: ev.resultType }))
    this.resultDisplayTimeoutId = setTimeout(() => {
      if (!this.isActive) return
      this.bus.post(new GameEndEvent(this.gameId))
    }, RESULT_DISPLAY_TIME_SECONDS * 1000)
  }

  /**
   * ちゅられん参加者はちゅらバースの攻撃を受けない
   */
  private readonly skipChuraverseDamage = (ev: LivingDamageEvent): void => {
    if (!isWeaponDamageCause(ev.cause)) return
    if (isPlayer(ev.target) && this.joinedPlayerIds.includes(ev.target.id)) {
      ev.cancel()
    }
  }

  private async sequence(): Promise<void> {
    await this.store.of('churarenPlugin').churarenGameSequence.runSequence()
  }
}

declare module '@churaverse/game-plugin-server' {
  export interface GameIdsMap {
    churaren: ChurarenCorePlugin
  }
}
