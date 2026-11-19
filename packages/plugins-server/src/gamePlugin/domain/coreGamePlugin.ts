import type { EntityDespawnEvent } from 'churaverse-engine-server'
import '@churaverse/player-plugin-server'
import { isPlayer } from '@churaverse/player-plugin-server'
import type { GameAbortEvent } from '../event/gameAbortEvent'
import type { GameEndEvent } from '../event/gameEndEvent'
import type { GameHostEvent } from '../event/gameHostEvent'
import type { GameMidwayJoinEvent } from '../event/gameMidwayJoinEvent'
import type { GamePlayerQuitEvent } from '../event/gamePlayerQuitEvent'
import { GameStartEvent } from '../event/gameStartEvent'
import type { PriorGameDataEvent } from '../event/priorGameDataEvent'
import type { SubmitGameJoinEvent } from '../event/submitGameJoinEvent'
import { GameHostingManager } from '../gameHostingManager'
import type { GameIds } from '../interface/gameIds'
import type { GamePolicy } from '../interface/gamePolicy'
import type { IGameHostingManager } from '../interface/IGameHostingManager'
import type { IGameInfo } from '../interface/IGameInfo'
import { ResponseGameAbortMessage } from '../message/gameAbortMessage'
import { ResponseGameEndMessage } from '../message/gameEndMessage'
import { ResponseGameHostMessage } from '../message/gameHostMessage'
import { ResponseGameMidwayJoinMessage } from '../message/gameMidwayJoinMessage'
import { GameStartMessage } from '../message/gameStartMessage'
import { PriorGameDataMessage } from '../message/priorGameDataMessage'
import type { GameState } from '../type/gameState'
import { BaseGamePlugin } from './baseGamePlugin'

/**
 * BaseGamePluginを拡張したCoreなゲーム抽象クラス
 */
export abstract class CoreGamePlugin extends BaseGamePlugin implements IGameInfo {
  public abstract gameId: GameIds
  public abstract gamePolicy: GamePolicy
  private _isActive: boolean = false
  private _gameOwnerId?: string
  private _gameState: GameState = 'inactive'
  private _joinedPlayerIds: string[] = []
  private gameHostingManager?: IGameHostingManager
  private joinTimeoutId?: ReturnType<typeof setTimeout>

  public get isActive(): boolean {
    return this._isActive
  }

  public get gameOwnerId(): string | undefined {
    return this._gameOwnerId
  }

  public get joinedPlayerIds(): string[] {
    return this._joinedPlayerIds
  }

  public get gameState(): GameState {
    return this._gameState
  }

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('gameStart', this.gameStart.bind(this), 'HIGH')
    this.bus.subscribeEvent('priorGameData', this.priorGameData.bind(this))
    this.bus.subscribeEvent('gameHost', this.gameHost.bind(this))
    this.bus.subscribeEvent('submitGameJoin', this.onSubmitGameJoin.bind(this))
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('gameAbort', this.gameAbort)
    this.bus.subscribeEvent('gameEnd', this.gameEnd)
    this.bus.subscribeEvent('entityDespawn', this.onPlayerLeave)
    this.bus.subscribeEvent('gamePlayerQuit', this.onPlayerQuitGame)
    this.bus.subscribeEvent('gameMidwayJoin', this.onPlayerMidwayJoin)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('gameAbort', this.gameAbort)
    this.bus.unsubscribeEvent('gameEnd', this.gameEnd)
    this.bus.unsubscribeEvent('entityDespawn', this.onPlayerLeave)
    this.bus.unsubscribeEvent('gamePlayerQuit', this.onPlayerQuitGame)
    this.bus.unsubscribeEvent('gameMidwayJoin', this.onPlayerMidwayJoin)
  }

  private priorGameData(ev: PriorGameDataEvent): void {
    if (!this.isActive) return
    this.store.of('networkPlugin').messageSender.send(
      new PriorGameDataMessage({
        runningGameId: this.gameId,
        ownerId: this.gameOwnerId ?? '',
        gameState: this.gameState,
      }),
      ev.senderId
    )
  }

  private gameHost(ev: GameHostEvent): void {
    this._isActive = this.gameId === ev.gameId
    if (!this.isActive) return
    this._gameState = 'host'
    this._gameOwnerId = ev.ownerId
    this.gamePluginStore.games.set(this.gameId, this)
    const timeoutSec = 30
    const responseGameHostMessage = new ResponseGameHostMessage({
      gameId: this.gameId,
      ownerId: this.gameOwnerId ?? '',
      timeoutSec,
    })
    this.store.of('networkPlugin').messageSender.send(responseGameHostMessage)

    this.gameHostingManager = new GameHostingManager(this.store.of('playerPlugin').players.getAllId())
    this.joinTimeoutId = setTimeout(() => {
      this.invokeGameStart()
    }, timeoutSec * 1000)
  }

  private onSubmitGameJoin(ev: SubmitGameJoinEvent): void {
    if (!this.isActive || this.gameHostingManager === undefined) return
    this.gameHostingManager.set(ev.playerId, ev.willJoin)
    if (this.gameHostingManager.isAllPlayersResponded()) {
      this.invokeGameStart()
    }
  }

  private gameStart(ev: GameStartEvent): void {
    if (!this.isActive) return
    this._gameState = 'start'
    const gameStartMessage = new GameStartMessage({
      gameId: ev.gameId,
      ownerId: ev.playerId,
      joinedPlayerIds: this.joinedPlayerIds,
    })
    this.store.of('networkPlugin').messageSender.send(gameStartMessage)
  }

  private readonly gameAbort = (ev: GameAbortEvent): void => {
    if (ev.gameId !== this.gameId) return
    const gameAbortMessage = new ResponseGameAbortMessage({ gameId: this.gameId, playerId: ev.playerId })
    this.store.of('networkPlugin').messageSender.send(gameAbortMessage)
    this.terminateGame()
  }

  private readonly gameEnd = (ev: GameEndEvent): void => {
    if (ev.gameId !== this.gameId) return
    const gameEndMessage = new ResponseGameEndMessage({ gameId: this.gameId })
    this.store.of('networkPlugin').messageSender.send(gameEndMessage)
    this.terminateGame()
  }

  private terminateGame(): void {
    this._isActive = false
    this._gameOwnerId = undefined
    this._gameState = 'inactive'
    this._joinedPlayerIds = []
    this.gamePluginStore.games.delete(this.gameId)
  }

  /**
   * ちゅらバースから退出したプレイヤーがゲーム参加者の場合、参加者リストから削除しtrueを返す
   */
  private readonly onPlayerLeave = (ev: EntityDespawnEvent): void => {
    // booleanの評価をするのではなく型ガードのため部分的にeslintを無効化
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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
    this.handlePlayerQuitGame(ev.playerId)
  }

  /**
   * プレイヤーが参加中のゲームから離脱した時の処理
   * @param playerId ゲームから離脱したプレイヤーのID
   */
  protected abstract handlePlayerQuitGame(playerId: string): void

  private readonly onPlayerMidwayJoin = (ev: GameMidwayJoinEvent): void => {
    if (!this.isActive) return
    if (!this.gamePolicy.allowMidwayJoin) throw new Error('このゲームは途中参加を許可していません')
    this._joinedPlayerIds.push(ev.playerId)
    const responseGameMidwayJoinMessage = new ResponseGameMidwayJoinMessage({
      gameId: this.gameId,
      joinPlayerId: ev.playerId,
      joinedPlayerIds: this.joinedPlayerIds,
    })
    this.store.of('networkPlugin').messageSender.send(responseGameMidwayJoinMessage)
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

  private invokeGameStart(): void {
    if (!this.isActive || this.joinTimeoutId === undefined || this.gameHostingManager === undefined) return
    clearTimeout(this.joinTimeoutId)
    this.joinTimeoutId = undefined
    this.gameHostingManager.timeoutResponse()
    this._joinedPlayerIds = this.gameHostingManager.getJoinedPlayerIds()
    this.gameHostingManager = undefined
    const gameStartEvent = new GameStartEvent(this.gameId, this.gameOwnerId ?? '')
    this.bus.post(gameStartEvent)
  }
}
