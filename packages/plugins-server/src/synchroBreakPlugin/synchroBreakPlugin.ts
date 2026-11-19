import type { GamePolicy } from '@churaverse/game-plugin-server'
import { CoreGamePlugin, GameEndEvent } from '@churaverse/game-plugin-server'
import type { NetworkPluginStore } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { SynchroBreakPluginError } from './errors/synchroBreakPluginError'
import type { NyokkiEvent } from './event/nyokkiEvent'
import type { SendBetCoinEvent } from './event/sendBetCoinEvent'
import type { SynchroBreakGameSettingEvent } from './event/synchroBreakGameSettingEvent'
import type { SynchroBreakTurnEndEvent } from './event/synchroBreakTurnEndEvent'
import type { SynchroBreakTurnStartEvent } from './event/synchroBreakTurnStartEvent'
import type { IGameSequence } from './interface/IGameSequence'
import { GameSequence } from './logic/gameSequence'
import { NyokkiActionResponseMessage } from './message/nyokkiActionResponseMessage'
import { SendBetCoinResponseMessage } from './message/sendBetCoinResponseMessage'
import { SynchroBreakTurnEndMessage } from './message/synchroBreakTurnEndMessage'
import { SynchroBreakTurnStartMessage } from './message/synchroBreakTurnStartMessage'
import { UpdatePlayersCoinMessage } from './message/updatePlayersCoinMessage'
import { Nyokki } from './model/nyokki'
import type { SynchroBreakPluginStore } from './store/defSynchroBreakPluginStore'
import { initSynchroBreakPluginStore, resetSynchroBreakPluginStore } from './store/synchroBreakPluginStoreManager'

export const SYNCHRO_BREAK_MID_RESULT_TIME_LIMIT = 3000
export const BET_TIMER_TIME_LIMIT = 20000 // 20 秒

export class SynchroBreakPlugin extends CoreGamePlugin {
  public readonly gameId = 'synchroBreak'
  public readonly gamePolicy: GamePolicy = {
    allowMidwayJoin: false,
  }

  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private synchroBreakPluginStore!: SynchroBreakPluginStore
  private socketController!: SocketController
  private gameSequence!: IGameSequence
  private sameTimePlayers: string[] = []
  private readonly nyokkiDurationTime = 100
  private readonly initialPlayerCoins = 100

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('start', this.start.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
  }

  /**
   * ゲームが開始された時に登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('synchroBreakGameSetting', this.synchroBreakGameSetting)
    this.bus.subscribeEvent('sendBetCoin', this.sendBetCoin)
    this.bus.subscribeEvent('nyokki', this.nyokkiAction)
    this.bus.subscribeEvent('synchroBreakTurnEnd', this.synchroBreakTurnEnd)
    this.bus.subscribeEvent('synchroBreakTurnStart', this.synchroBreakTurnStart)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('synchroBreakGameSetting', this.synchroBreakGameSetting)
    this.bus.unsubscribeEvent('sendBetCoin', this.sendBetCoin)
    this.bus.unsubscribeEvent('nyokki', this.nyokkiAction)
    this.bus.unsubscribeEvent('synchroBreakTurnEnd', this.synchroBreakTurnEnd)
    this.bus.unsubscribeEvent('synchroBreakTurnStart', this.synchroBreakTurnStart)
  }

  private start(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  /**
   * シンクロブレイク特有の開始時に実行される処理
   */
  protected handleGameStart(): void {
    initSynchroBreakPluginStore(this.store)
    this.socketController.registerMessageListener()
    this.synchroBreakPluginStore = this.store.of('synchroBreakPlugin')
    this.gameSequence = new GameSequence(this.gameId, this.bus, this.store)
    for (const playerId of this.joinedPlayerIds) {
      this.synchroBreakPluginStore.playersCoinRepository.set(playerId, this.initialPlayerCoins)
    }
    const sortedPlayersCoin = this.synchroBreakPluginStore.playersCoinRepository.sortedPlayerCoins()
    this.networkPluginStore.messageSender.send(new UpdatePlayersCoinMessage({ playersCoin: sortedPlayersCoin }))
  }

  /**
   * シンクロブレイク特有の中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    resetSynchroBreakPluginStore(this.store)
    this.socketController.unregisterMessageListener()
  }

  /**
   * 参加者がちゅらバースから退出した時の処理
   * @param playerId 離脱したプレイヤーのID
   */
  protected handlePlayerLeave(playerId: string): void {
    if (playerId === this.gameOwnerId) {
      // 管理者が退出した場合、シンクロブレイクは終了する。
      this.bus.post(new GameEndEvent(this.gameId))
    } else {
      this.synchroBreakPluginStore.playersCoinRepository.delete(playerId)
      this.synchroBreakPluginStore.betCoinRepository.delete(playerId)
      this.synchroBreakPluginStore.nyokkiRepository.delete(playerId)
    }
  }

  /**
   * 参加者がシンクロブレイクを離脱した時の処理
   * 結果ウィンドウの閉じるボタンを押した時に実行される
   */
  protected handlePlayerQuitGame(_playerId: string): void {
    if (this.joinedPlayerIds.length <= 0) {
      this.bus.post(new GameEndEvent(this.gameId))
    }
  }

  private readonly synchroBreakGameSetting = (ev: SynchroBreakGameSettingEvent): void => {
    this.synchroBreakPluginStore.turnSelect = ev.allTurn
    this.synchroBreakPluginStore.timeLimit = Number(ev.timeLimit)
    this.gameSequence.processTurnSequence().catch((error) => {
      console.error('ゲーム開始確認処理でエラーが発生しました:', error)
    })
  }

  /**
   * ベットコインが設定された時の処理
   */
  private readonly sendBetCoin = (ev: SendBetCoinEvent): void => {
    const playerId = ev.playerId
    const betCoins = ev.betCoins
    this.synchroBreakPluginStore.betCoinRepository.set(playerId, betCoins)

    const coins = this.synchroBreakPluginStore.playersCoinRepository.get(playerId)

    const currentCoins = coins - betCoins
    this.synchroBreakPluginStore.playersCoinRepository.set(playerId, currentCoins)
    this.networkPluginStore.messageSender.send(new SendBetCoinResponseMessage({ playerId, betCoins, currentCoins }))
  }

  /**
   * プレイヤーがニョッキアクションを実行した際の処理
   */
  private readonly nyokkiAction = (ev: NyokkiEvent): void => {
    const playerId = ev.playerId
    const nyokkiTime = Date.now()
    const nyokki = new Nyokki(playerId, nyokkiTime)
    this.synchroBreakPluginStore.nyokkiRepository.set(playerId, nyokki)

    const sameTimePlayerNum = this.sameTimePlayers.length
    if (sameTimePlayerNum === 0) {
      this.sameTimePlayers.push(playerId)

      setTimeout(() => {
        this.nyokkiActionResponse(nyokkiTime)
      }, this.nyokkiDurationTime)
    } else {
      this.sameTimePlayers.push(playerId)
    }
  }

  /**
   * ニョッキアクションの結果を返す
   */
  private nyokkiActionResponse(nyokkiTime: number): void {
    const sameTimePlayersId = this.sameTimePlayers

    // isSuccessがtrueならば成功, falseならば失敗
    const isSuccess = this.sameTimePlayers.length === 1
    this.sameTimePlayers.forEach((playerId) => {
      this.synchroBreakPluginStore.nyokkiRepository.addNyokki(playerId, isSuccess)
    })

    const playerOrders = this.synchroBreakPluginStore.nyokkiRepository.playerOrders()

    const order = playerOrders.indexOf(this.sameTimePlayers[0]) + 1
    const nyokkiActionMessage = new NyokkiActionResponseMessage({
      sameTimePlayersId,
      isSuccess,
      nyokkiTime,
      order,
    })
    this.networkPluginStore.messageSender.send(nyokkiActionMessage)
    this.sameTimePlayers = []
  }

  /**
   * ターンが開始した際の処理
   */
  private readonly synchroBreakTurnStart = (ev: SynchroBreakTurnStartEvent): void => {
    const sortedPlayersCoin = this.synchroBreakPluginStore.playersCoinRepository.sortedPlayerCoins()
    this.networkPluginStore.messageSender.send(new UpdatePlayersCoinMessage({ playersCoin: sortedPlayersCoin }))

    const turnNumber = ev.turnNumber
    const synchroBreakTurnStartMessage = new SynchroBreakTurnStartMessage({ turnNumber })
    this.networkPluginStore.messageSender.send(synchroBreakTurnStartMessage)
    this.gameSequence.processTurnSequence().catch((error) => {
      console.error('ゲーム開始確認処理でエラーが発生しました:', error)
    })
  }

  /**
   * ターンが終了した際の処理
   */
  private readonly synchroBreakTurnEnd = (_ev: SynchroBreakTurnEndEvent): void => {
    const nyokkiRepository: string[] = this.synchroBreakPluginStore.nyokkiRepository.getAllPlayerId()

    // ニョッキしていないプレイヤーIdを取得
    const noNyokkiPlayerIds = this.joinedPlayerIds.filter((playerId) => !nyokkiRepository.includes(playerId))
    const synchroBreakTurnSelect = this.synchroBreakPluginStore.turnSelect

    if (synchroBreakTurnSelect === undefined) throw new SynchroBreakPluginError('ターン情報が存在しません')
    const synchroBreakTurnEndMessage = new SynchroBreakTurnEndMessage({
      noNyokkiPlayerIds,
    })
    this.networkPluginStore.messageSender.send(synchroBreakTurnEndMessage)

    this.calculateResultPlayersCoin()

    this.resetTurnRepository()
  }

  /**
   * ニョッキコレクションとベットコインレポジトリをリセットする
   */
  private resetTurnRepository(): void {
    this.synchroBreakPluginStore.nyokkiRepository.clear()
    this.synchroBreakPluginStore.betCoinRepository.clear()
  }

  /**
   * プレイヤーのコインを計算する
   */
  private calculateResultPlayersCoin(): void {
    this.joinedPlayerIds.forEach((playerId) => {
      const calculatedCoins = this.calculateCoins(playerId)
      this.synchroBreakPluginStore.playersCoinRepository.set(playerId, calculatedCoins)
    })
  }

  /**
   * プレイヤーのアクションに対して、ベットコインと倍率のコイン数を計算する
   */
  private calculateCoins(playerId: string): number {
    const currentCoins = this.synchroBreakPluginStore.playersCoinRepository.get(playerId)

    const player: Nyokki | undefined = this.synchroBreakPluginStore.nyokkiRepository.get(playerId)
    if (player === undefined) return currentCoins

    const betCoins = this.synchroBreakPluginStore.betCoinRepository.get(playerId)
    const totalPlayerNum = this.joinedPlayerIds.length
    const playerOrder: string[] = this.synchroBreakPluginStore.nyokkiRepository.playerOrders()
    const orderIndex = playerOrder.indexOf(playerId)

    // ニョッキに成功した場合はコインの増加量を計算し、失敗した場合は現在のコイン数をそのまま返す
    return orderIndex !== -1 ? currentCoins + betCoins * (totalPlayerNum - orderIndex) : currentCoins
  }
}

declare module '@churaverse/game-plugin-server' {
  export interface GameIdsMap {
    synchroBreak: SynchroBreakPlugin
  }
}
