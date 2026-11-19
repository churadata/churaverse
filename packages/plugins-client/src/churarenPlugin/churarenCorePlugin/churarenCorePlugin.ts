import type {
  BaseGamePlugin,
  GamePolicy,
  IGameSelectionListItemRenderer,
  RegisterGameUiEvent,
} from '@churaverse/game-plugin-client'
import { CoreGamePlugin, GamePlayerQuitEvent } from '@churaverse/game-plugin-client'
import { CHURAREN_CONSTANTS } from './constants/churarenConstants'
import { SocketController } from './controller/socketController'
import type { ChurarenResultEvent } from './event/churarenResultEvent'
import { CHURAREN_UI_KEYS } from './ui/defChurarenUi'
import { registerChurarenUi } from './ui/registerChurarenUi'
import { ChurarenListItemRenderer } from './ui/startWindow/churarenListItemRenderer'
import '@churaverse/player-plugin-client'
import { type EntitySpawnEvent, EVENT_PRIORITY } from 'churaverse-engine-client'
import { setupChurarenDialog } from './ui/startWindow/setupChurarenDialog'
import { isWeaponEntity } from './util/isWeaponEntity'

export class ChurarenCorePlugin extends CoreGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  protected gameName = CHURAREN_CONSTANTS.GAME_NAME
  public readonly gamePolicy: GamePolicy = {
    allowMidwayJoin: false,
  }

  protected readonly ownerExitMessage = `あなたはゲームオーナーです。あなたが退出すると${this.gameName}が終了します`

  private socketController?: SocketController
  protected gameEntryRenderer!: IGameSelectionListItemRenderer

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('start', this.start.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerGameUi', this.registerGameUi.bind(this))
  }

  /**
   * ゲームが開始された時に登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('churarenStartCountdown', this.startCountdown)
    this.bus.subscribeEvent('churarenStartTimer', this.startTimer)
    this.bus.subscribeEvent('churarenResult', this.resultChurarenUi)
    this.bus.subscribeEvent('entitySpawn', this.cancelChruaverseAction, EVENT_PRIORITY.HIGH)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('churarenStartCountdown', this.startCountdown)
    this.bus.unsubscribeEvent('churarenStartTimer', this.startTimer)
    this.bus.unsubscribeEvent('churarenResult', this.resultChurarenUi)
    this.bus.unsubscribeEvent('entitySpawn', this.cancelChruaverseAction)
  }

  private start(): void {
    setupChurarenDialog(this.bus, this.store)
    this.gameEntryRenderer = new ChurarenListItemRenderer(
      this.store,
      this.gamePolicy,
      this.gamePluginStore.gameSelectionListContainer
    )
  }

  protected registerGameUi(ev: RegisterGameUiEvent): void {
    registerChurarenUi(this.store, this.gameId, ev.gameUiRegister)
  }

  /**
   * ゲームが開始された時の処理
   */
  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  /**
   * 中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
  }

  /**
   * 途中参加時の処理
   */
  protected handleMidwayJoin(): void {
    this.unsubscribeGameEvent()
    // `gameAbort` や `gameEnd` イベントを受け取るために `CoreGamePlugin` のイベントのみsubscribeする
    super.subscribeGameEvent()
  }

  protected handlePlayerLeave(playerId: string): void {
    this.bus.post(new GamePlayerQuitEvent(this.gameId, playerId))
  }

  protected handlePlayerQuitGame(_playerId: string): void {}

  private readonly startCountdown = (): void => {
    const countdownWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.COUNTDOWN_WINDOW)
    countdownWindow?.startCountdown()
  }

  private readonly startTimer = (): void => {
    this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.COUNTDOWN_WINDOW)?.hideCountdown()
    const timerContainer = this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.TIMER_CONTAINER)
    timerContainer?.startTimer()
  }

  private readonly resultChurarenUi = (ev: ChurarenResultEvent): void => {
    this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.TIMER_CONTAINER)?.hideTimer()
    const resultWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.RESULT_WINDOW)
    resultWindow?.showResult(ev.resultType)
    resultWindow?.buttonElement.addEventListener('click', () => {
      this.bus.post(new GamePlayerQuitEvent(this.gameId, this.store.of('playerPlugin').ownPlayerId))
      resultWindow.remove()
    })
  }

  /**
   * ちゅられん参加者はちゅらバースの攻撃を撃てない
   */
  private readonly cancelChruaverseAction = (ev: EntitySpawnEvent): void => {
    if (!isWeaponEntity(ev.entity)) return
    if (this.joinedPlayerIds.includes(ev.entity.ownerId)) {
      ev.cancel()
    }
  }
}

declare module '@churaverse/game-plugin-client' {
  export interface GameIdsMap {
    churaren: BaseGamePlugin
  }
}
