import type { CoreUiPluginStore } from '@churaverse/core-ui-plugin-client'
import type { NetworkPluginStore } from '@churaverse/network-plugin-client'
import type { PlayerPluginStore } from '@churaverse/player-plugin-client'
import { isPlayer } from '@churaverse/player-plugin-client'
import type { EntityDespawnEvent, IMainScene } from 'churaverse-engine-client'
import type { GameAbortEvent } from '../event/gameAbortEvent'
import type { GameEndEvent } from '../event/gameEndEvent'
import type { GameHostEvent } from '../event/gameHostEvent'
import type { GameMidwayJoinEvent } from '../event/gameMidwayJoinEvent'
import type { GamePlayerQuitEvent } from '../event/gamePlayerQuitEvent'
import type { GameStartEvent } from '../event/gameStartEvent'
import type { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { SubmitGameJoinEvent } from '../event/submitGameJoinEvent'
import type { GameIds } from '../interface/gameIds'
import type { GamePolicy } from '../interface/gamePolicy'
import type { IGameInfo } from '../interface/IGameInfo'
import type { IGameSelectionListItemRenderer } from '../interface/IGameSelectionListItemRenderer'
import { GamePlayerQuitMessage } from '../message/gamePlayerQuitMessage'
import { SubmitGameJoinMessage } from '../message/submitGameJoinMessage'
import type { GamePluginStore } from '../store/defGamePluginStore'
import type { GameState } from '../type/gameState'
import { BaseGamePlugin } from './baseGamePlugin'
import '@churaverse/transition-plugin-client'

/**
 * BaseGamePluginを拡張したCoreなゲーム抽象クラス
 */
export abstract class CoreGamePlugin extends BaseGamePlugin implements IGameInfo {
  public abstract gameId: GameIds
  protected abstract gameEntryRenderer: IGameSelectionListItemRenderer
  protected abstract gameName: string
  public abstract gamePolicy: GamePolicy
  protected abstract ownerExitMessage: string
  private _isActive: boolean = false
  private _gameOwnerId?: string
  private _joinedPlayerIds: string[] = []
  private _isJoined: boolean = false
  private _gameState: GameState = 'inactive'
  protected gamePluginStore!: GamePluginStore
  protected playerPluginStore!: PlayerPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private coreUiPluginStore!: CoreUiPluginStore

  public get isActive(): boolean {
    return this._isActive
  }

  public get gameOwnerId(): string | undefined {
    return this._gameOwnerId
  }

  public get joinedPlayerIds(): string[] {
    return this._joinedPlayerIds
  }

  public get isJoined(): boolean {
    return this._isJoined
  }

  public get gameState(): GameState {
    return this._gameState
  }

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('priorGameData', this.priorGameData.bind(this), 'HIGH')
    this.bus.subscribeEvent('gameHost', this.gameHost.bind(this))
    this.bus.subscribeEvent('submitGameJoin', this.submitGameJoin.bind(this))
    this.bus.subscribeEvent('gameStart', this.gameStart.bind(this), 'HIGH')
    this.bus.subscribeEvent('gameAbort', this.gameAbort.bind(this))
    this.bus.subscribeEvent('gameEnd', this.gameEnd.bind(this))
    this.bus.subscribeEvent('gameMidwayJoin', this.gameMidwayJoin.bind(this))
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('entityDespawn', this.onPlayerLeave)
    this.bus.subscribeEvent('gamePlayerQuit', this.onPlayerQuitGame)
    this.bus.subscribeEvent('willSceneTransition', this.terminateGame)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('entityDespawn', this.onPlayerLeave)
    this.bus.unsubscribeEvent('gamePlayerQuit', this.onPlayerQuitGame)
    this.bus.unsubscribeEvent('willSceneTransition', this.terminateGame)
  }

  private init(): void {
    this.gamePluginStore = this.store.of('gamePlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.coreUiPluginStore = this.store.of('coreUiPlugin')
  }

  private priorGameData(ev: PriorGameDataEvent): void {
    this._isActive = this.gameId === ev.runningGameId
    this.gameEntryRenderer.onPriorGameData(ev.runningGameId, ev.gameState)
    if (!this.isActive) return
    this._gameState = ev.gameState
    this._gameOwnerId = ev.ownerId
    this.gamePluginStore.gameLogRenderer.gameLog(`${this.gameName}が開始されています。`, 400)
    this.gameInfoStore.games.set(this.gameId, this)
  }

  private gameHost(ev: GameHostEvent): void {
    this._isActive = this.gameId === ev.gameId
    this.gameEntryRenderer.onGameHost(ev.gameId)
    if (!this.isActive) return
    this._gameState = 'host'
    this._gameOwnerId = ev.ownerId
    this.gameInfoStore.games.set(this.gameId, this)
    this.gamePluginStore.gameAbortAlertConfirm.setGameAbortMessage(this.gameName)
    this.gamePluginStore.countdownTimer.start(ev.timeoutSec)

    if (ev.ownerId === this.playerPluginStore.ownPlayerId) {
      this.gamePluginStore.gameDescriptionDialogManager.showDialog(this.gameId, 'viewOnly')
      this.bus.post(new SubmitGameJoinEvent(this.gameId, true))

      this.coreUiPluginStore.exitButton.setExitMessage(`${this.ownerExitMessage}`)
    } else {
      this.gamePluginStore.gameDescriptionDialogManager.showDialog(this.gameId, 'joinable')
    }
  }

  private submitGameJoin(ev: SubmitGameJoinEvent): void {
    if (ev.gameId !== this.gameId) return
    this._isJoined = ev.willJoin

    if (this.isJoined) {
      this.gamePluginStore.gameUiManager.initializeAllUis(this.gameId)
    } else {
      this.gamePluginStore.countdownTimer.close()
    }

    const submitGameJoinMessage = new SubmitGameJoinMessage({
      gameId: this.gameId,
      willJoin: this.isJoined,
    })
    this.networkPluginStore.messageSender.send(submitGameJoinMessage)
  }

  protected gameStart(ev: GameStartEvent): void {
    this.gameEntryRenderer.onGameStart(ev.gameId, this.isJoined)
    if (!this.isActive) return
    this._gameState = 'start'
    this._gameOwnerId = ev.playerId
    this._joinedPlayerIds = ev.joinedPlayerIds
    this.gamePluginStore.countdownTimer.close()
    this.gamePluginStore.gameDescriptionDialogManager.closeDialog()
    this.gamePluginStore.gameLogRenderer.gameStartLog(this.gameName, this.gameOwnerId ?? '')
    this.gameInfoStore.games.set(this.gameId, this)
    this.gamePluginStore.gameAbortAlertConfirm.setGameAbortMessage(this.gameName)
    if (this._gameOwnerId === this.playerPluginStore.ownPlayerId) {
      this.coreUiPluginStore.exitButton.setExitMessage(`${this.ownerExitMessage}`)
    }
  }

  private gameAbort(ev: GameAbortEvent): void {
    this.gameEntryRenderer.resetStartButton()
    if (ev.gameId !== this.gameId) return
    this.gamePluginStore.gameLogRenderer.gameAbortLog(this.gameName, ev.playerId)
    this.terminateGame()
  }

  private gameEnd(ev: GameEndEvent): void {
    this.gameEntryRenderer.resetStartButton()
    if (ev.gameId !== this.gameId) return
    this.gamePluginStore.gameLogRenderer.gameEndLog(this.gameName)
    this.terminateGame()
  }

  private terminateGame = (): void => {
    this._isActive = false
    this._gameOwnerId = undefined
    this._joinedPlayerIds = []
    this.gameInfoStore.games.delete(this.gameId)
    this._gameState = 'inactive'

    this.coreUiPluginStore.exitButton.setExitMessage('このミーティングから退出しますか？')

    if (this.isJoined) {
      this.gamePluginStore.gameUiManager.removeAllUis(this.gameId)
      this._isJoined = false
    }
  }

  private readonly onPlayerLeave = (ev: EntityDespawnEvent): void => {
    if (!isPlayer(ev.entity)) return
    const playerId: string = ev.entity.id
    if (!this.removeJoinedPlayer(playerId)) return
    this.handlePlayerLeave(playerId)
  }

  /**
   * プレイヤーがちゅらバースから退出した時の処理
   * @param playerId 退出したプレイヤーのID
   */
  protected abstract handlePlayerLeave(playerId: string): void

  private readonly onPlayerQuitGame = (ev: GamePlayerQuitEvent): void => {
    if (!this.removeJoinedPlayer(ev.playerId)) return
    const gamePlayerQuitMessage = new GamePlayerQuitMessage({ gameId: ev.gameId, playerId: ev.playerId })
    this.networkPluginStore.messageSender.send(gamePlayerQuitMessage)
    this.handlePlayerQuitGame(ev.playerId)
  }

  /**
   * プレイヤーが参加中のゲームから離脱した時の処理
   * @param playerId ゲームから離脱したプレイヤーのID
   */
  protected abstract handlePlayerQuitGame(playerId: string): void

  private gameMidwayJoin(ev: GameMidwayJoinEvent): void {
    if (!this.isActive || !ev.joinedPlayerIds.includes(this.playerPluginStore.ownPlayerId)) return
    this.gamePluginStore.gameLogRenderer.gameMidwayJoinLog(this.gameName, ev.joinPlayerId)
    this._joinedPlayerIds = ev.joinedPlayerIds
    if (ev.joinPlayerId === this.playerPluginStore.ownPlayerId) {
      this.gameEntryRenderer.onGameStart(this.gameId, true)
    }
  }

  /**
   * 退出したプレイヤーがゲーム参加者の場合、参加者リストから削除しtrueを返す
   */
  private removeJoinedPlayer(playerId: string): boolean {
    const idx = this._joinedPlayerIds.indexOf(playerId)
    if (idx === -1) return false
    this._joinedPlayerIds.splice(idx, 1)
    return true
  }
}
