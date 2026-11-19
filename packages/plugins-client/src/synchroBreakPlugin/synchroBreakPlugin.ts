import type { GamePolicy, IGameSelectionListItemRenderer, RegisterGameUiEvent } from '@churaverse/game-plugin-client'
import { CoreGamePlugin } from '@churaverse/game-plugin-client'
import { PlayerRendererNotFoundError } from '@churaverse/player-plugin-client'
import type { PhaserLoadAssets, PhaserSceneInit } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import { SocketController } from './controller/socketController'
import { SynchroBreakPluginError } from './errors/synchroBreakPluginError'
import { SynchroBreakUiNotFoundError } from './errors/synchroBreakUiNotFoundError'
import type { BetTimeRemainingEvent } from './event/betTimeRemainingEvent'
import type { NyokkiActionResponseEvent } from './event/nyokkiActionResponseEvent'
import type { SendBetCoinResponseEvent } from './event/sendBetCoinResponseEvent'
import type { SynchroBreakTurnStartEvent } from './event/synchroBerakTurnStartEvent'
import type { SynchroBreakGameSettingEvent } from './event/synchroBreakGameSettingEvent'
import type { SynchroBreakResultEvent } from './event/synchroBreakResultEvent'
import type { SynchroBreakStartCountEvent } from './event/synchroBreakStartCountEvent'
import type { SynchroBreakTurnEndEvent } from './event/synchroBreakTurnEndEvent'
import type { SynchroBreakTurnTimerEvent } from './event/synchroBreakTurnTimerEvent'
import type { UpdatePlayersCoinEvent } from './event/updatePlayersCoinEvent'
import type { IBetCoinFormContainer } from './interface/IBetCoinFormContainer'
import type { IBetTimer } from './interface/IBetTimer'
import type { ICountdownBar } from './interface/ICountdownBar'
import type { IDescriptionWindow } from './interface/IDescriptionWindow'
import type { IOwnRankingBoard } from './interface/IOwnRankingBoard'
import type { SynchroBreakPluginStore } from './store/defSynchroBreakPluginStore'
import { initSynchroBreakPluginStore, resetSynchroBreakPluginStore } from './store/synchroBreakPluginStoreManager'
import type { NyokkiStatus } from './type/nyokkiStatus'
import { RESULT_SCREEN_TYPES, type ResultScreenType } from './type/resultScreenType'
import { CoinViewer } from './ui/coinViewer/coinViewer'
import { CoinViewerIcon } from './ui/coinViewer/coinViewerIcon'
import { registerSynchroBreakUi } from './ui/registerSynchroBreakUi'
import { setupSynchroBreakDialogManager } from './ui/startWindow/setupSynchroBreakDialogManager'
import { SynchroBreakListItemRenderer } from './ui/startWindow/synchroBreakListItemRenderer'
import { PlayerNyokkiStatusIcon } from './ui/synchroBreakIcon/playerNyokkiStatusIcon'

export const BET_TIMER_TIME_LIMIT = 20000

export class SynchroBreakPlugin extends CoreGamePlugin {
  public readonly gameId = 'synchroBreak'
  protected readonly gameName = 'シンクロブレイク'
  public readonly gamePolicy: GamePolicy = {
    allowMidwayJoin: false,
  }

  protected readonly ownerExitMessage = `あなたはゲームオーナーです。あなたが退出すると${this.gameName}が終了します`

  private nyokkiActionMessage: string | undefined = undefined
  private ownNyokkiSatatus: NyokkiStatus = 'yet'
  protected gameEntryRenderer!: IGameSelectionListItemRenderer
  private synchroBreakPluginStore!: SynchroBreakPluginStore
  private scene!: Scene
  private coinViewerIconUis = new Map<string, CoinViewerIcon>()
  private socketController!: SocketController

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))
    this.bus.subscribeEvent('registerGameUi', this.registerGameUi.bind(this))
  }

  /**
   * ゲームが開始された時に登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('synchroBreakGameSetting', this.synchroBreakGameSetting)
    this.bus.subscribeEvent('sendBetCoinResponse', this.sendBetCoinResponse)
    this.bus.subscribeEvent('synchroBreakStartCount', this.gameStartCount)
    this.bus.subscribeEvent('synchroBreakTurnTimer', this.turnTimer)
    this.bus.subscribeEvent('nyokkiActionResponse', this.nyokkiActionResponse)
    this.bus.subscribeEvent('synchroBreakTurnEnd', this.synchroBreakTurnEnd)
    this.bus.subscribeEvent('synchroBreakTurnStart', this.synchroBreakTurnStart)
    this.bus.subscribeEvent('updatePlayersCoin', this.updatePlayersCoin)
    this.bus.subscribeEvent('synchroBreakResult', this.handleSynchroBreakResult)
    this.bus.subscribeEvent('betTimeRemaining', this.updateBetTimer)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('synchroBreakGameSetting', this.synchroBreakGameSetting)
    this.bus.unsubscribeEvent('sendBetCoinResponse', this.sendBetCoinResponse)
    this.bus.unsubscribeEvent('synchroBreakStartCount', this.gameStartCount)
    this.bus.unsubscribeEvent('synchroBreakTurnTimer', this.turnTimer)
    this.bus.unsubscribeEvent('nyokkiActionResponse', this.nyokkiActionResponse)
    this.bus.unsubscribeEvent('synchroBreakTurnEnd', this.synchroBreakTurnEnd)
    this.bus.unsubscribeEvent('synchroBreakTurnStart', this.synchroBreakTurnStart)
    this.bus.unsubscribeEvent('updatePlayersCoin', this.updatePlayersCoin)
    this.bus.unsubscribeEvent('synchroBreakResult', this.handleSynchroBreakResult)
    this.bus.unsubscribeEvent('betTimeRemaining', this.updateBetTimer)
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private start(): void {
    setupSynchroBreakDialogManager(this.bus, this.store)
    this.coinViewerIconUis = new Map<string, CoinViewerIcon>()
    this.gameInfoStore = this.store.of('gameInfo')
    this.gamePluginStore = this.store.of('gamePlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.gameEntryRenderer = new SynchroBreakListItemRenderer(
      this.store,
      this.gamePolicy,
      this.gamePluginStore.gameSelectionListContainer
    )
  }

  /**
   * シンクロブレイクゲームのアセットをロードする
   */
  private loadAssets(ev: PhaserLoadAssets): void {
    PlayerNyokkiStatusIcon.loadAssets(ev.scene)
    CoinViewer.loadAssets(ev.scene)
  }

  /**
   * ゲームUI登録のイベントを受け取った時の処理
   */
  private registerGameUi(ev: RegisterGameUiEvent): void {
    registerSynchroBreakUi(this.store, this.bus, this.scene, this.gameId, ev.gameUiRegister)
  }

  /**
   * シンクロブレイク特有の開始時に実行される処理
   */
  protected handleGameStart(): void {
    initSynchroBreakPluginStore(this.store)
    this.socketController.registerMessageListener()
    this.synchroBreakPluginStore = this.store.of('synchroBreakPlugin')
    this.initSynchroBreakPlayerIcons()
    this.nyokkiActionMessage = undefined
    this.ownNyokkiSatatus = 'yet'

    if (this.gameOwnerId === undefined) return
    const gameOwnerName = this.playerPluginStore.players.get(this.gameOwnerId)?.name ?? 'ゲームオーナー'
    this.descriptionWindow.setGameBaseInfo(this.gameName, gameOwnerName)
    if (this.gameOwnerId === this.playerPluginStore.ownPlayerId) {
      this.descriptionWindow.displayGameStartForOwner()
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'gameSettingConfirm')?.open()
    } else {
      this.descriptionWindow.displayGameStartForGuest()
    }
  }

  /**
   * シンクロブレイク特有の中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    resetSynchroBreakPluginStore(this.store)
    this.socketController.unregisterMessageListener()
    this.removeSynchroBreakIcons()
  }

  /**
   * シンクロブレイク特有の途中参加時の処理
   */
  protected handleMidwayJoin(): void {
    this.socketController.registerMessageListener()
  }

  /**
   * プレイヤーがちゅらバースから退出した時の処理
   * @param playerId 退出したプレイヤーのID
   */
  protected handlePlayerLeave(playerId: string): void {
    this.synchroBreakPluginStore.playersCoinRepository.delete(playerId)
  }

  /**
   * シンクロブレイクを離脱した時の処理
   * 結果ウィンドウの閉じるボタンを押した時に実行される
   */
  protected handlePlayerQuitGame(_playerId: string): void {
    this.removeSynchroBreakIcons()
    this.ownRankingBoard.remove()
    this.descriptionWindow.close()
  }

  /**
   * シンクロブレイク参加プレイヤーのUIアイコンを初期化する
   */
  private initSynchroBreakPlayerIcons(): void {
    for (const playerId of this.joinedPlayerIds) {
      const coinViewer = new CoinViewerIcon(this.scene, this.store, playerId)
      this.coinViewerIconUis.set(playerId, coinViewer)

      const playerRenderer = this.store.of('playerPlugin').playerRenderers.get(playerId)
      if (playerRenderer === undefined) throw new PlayerRendererNotFoundError(playerId)
      const playerSynchroBreakIcon = new PlayerNyokkiStatusIcon(this.scene, playerRenderer)
      this.synchroBreakPluginStore.synchroBreakIcons.set(playerId, playerSynchroBreakIcon)
    }
  }

  /**
   * ターンと制限時間が設定された時の処理
   */
  private readonly synchroBreakGameSetting = (ev: SynchroBreakGameSettingEvent): void => {
    this.synchroBreakPluginStore.gameTurn = ev.allTurn
    this.synchroBreakPluginStore.timeLimit = Number(ev.timeLimit)
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownCoins = this.synchroBreakPluginStore.playersCoinRepository.get(ownPlayerId)

    this.displayBetTimer()
    this.betCoinFormContainer.open()

    if (this.gameOwnerId === this.playerPluginStore.ownPlayerId) {
      this.descriptionWindow.displayGameSettingForOwner(ev.allTurn, ev.timeLimit, ownCoins)
    } else {
      this.descriptionWindow.displayGameSettingForGuest(ev.allTurn, ev.timeLimit, ownCoins)
    }
  }

  /**
   * ベットコインが設定された際の処理
   */
  private readonly sendBetCoinResponse = (ev: SendBetCoinResponseEvent): void => {
    const coinViewerIcon = this.coinViewerIconUis.get(ev.playerId)
    coinViewerIcon?.coinViewer?.setBetCoins(ev.betCoins)

    if (ev.playerId === this.playerPluginStore.ownPlayerId) {
      this.descriptionWindow.displayBetCoinSelection(ev.betCoins)
      this.betTimer.close()
    }

    this.synchroBreakPluginStore.playersCoinRepository.set(ev.playerId, ev.currentCoins)
    this.ownRankingBoard.updateRanking()
  }

  /**
   * ゲーム開始までのカウントダウンを表示する
   */
  private readonly gameStartCount = (ev: SynchroBreakStartCountEvent): void => {
    this.descriptionWindow.displayGameStartCountdown(ev.remainingSeconds)
  }

  /**
   * ターン中の残り時間を表示する
   */
  private readonly turnTimer = (ev: SynchroBreakTurnTimerEvent): void => {
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownPlayerName = this.playerPluginStore.players.get(ownPlayerId)?.name
    if (ev.remainingSeconds === this.synchroBreakPluginStore.timeLimit) {
      this.displayCountdownBar()
      this.countdownBar.updateDashOffset(ev.remainingSeconds)
      this.descriptionWindow.displaySynchroBreakStart()
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'nyokkiButton')?.open()
    } else {
      this.countdownBar.updateDashOffset(ev.remainingSeconds)
      if (this.ownNyokkiSatatus === 'yet') {
        this.descriptionWindow.displaySynchroBreakInProgress()
      } else {
        this.descriptionWindow.displaySynchroBreakInProgress(ownPlayerName, this.nyokkiActionMessage)
      }
    }
  }

  private readonly updateBetTimer = (ev: BetTimeRemainingEvent): void => {
    this.betTimer.updateTimer(ev.remainingTime)

    if (ev.remainingTime <= 0) {
      this.betCoinFormContainer.postBetCoinOnTimeout(this.playerPluginStore.ownPlayerId)
    }
  }

  /**
   * ニョッキアクションの実行結果を受け取った際の処理
   */
  private readonly nyokkiActionResponse = (ev: NyokkiActionResponseEvent): void => {
    const nyokkiCollectionPlayerIds = ev.sameTimePlayersId
    const isSuccess = ev.isSuccess

    const nyokkiLogText = this.synchroBreakPluginStore.nyokkiLogTextCreator.createNyokkiLogText(
      nyokkiCollectionPlayerIds,
      isSuccess,
      ev.nyokkiTime
    )
    if (nyokkiLogText !== undefined) {
      this.gamePluginStore.gameLogRenderer.gameLog(nyokkiLogText, 0)
    }

    const status: NyokkiStatus = isSuccess ? 'success' : 'nyokki'
    for (const nyokkiCollectionPlayerId of nyokkiCollectionPlayerIds) {
      this.ownRankingBoard.changeNyokkiStatus(nyokkiCollectionPlayerId, status)

      // ニョッキアクションの実行結果をプレイヤーに通知する
      if (nyokkiCollectionPlayerId === this.playerPluginStore.ownPlayerId && nyokkiLogText !== undefined) {
        this.ownNyokkiSatatus = status
        this.nyokkiActionMessage = nyokkiLogText
        this.descriptionWindow.displayNyokkiAction(nyokkiLogText)
      }

      // シンクロブレイクのニョッキアクションUIを表示させる。
      this.synchroBreakPluginStore.synchroBreakIcons
        .get(nyokkiCollectionPlayerId)
        ?.handlePlayerSynchroBreakIcons(ev.order, status)
    }
  }

  /**
   * ターンが終了した際の処理
   */
  private readonly synchroBreakTurnEnd = (ev: SynchroBreakTurnEndEvent): void => {
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'nyokkiButton')?.close()
    this.nyokkiActionMessage = undefined
    this.ownNyokkiSatatus = 'yet'

    this.countdownBar.close()
    this.descriptionWindow.displaySynchroBreakEnd()
    const noNyokkiPlayerIds = ev.noNyokkiPlayerIds
    const status: NyokkiStatus = 'nyokki'

    if (noNyokkiPlayerIds.length === 0) return
    for (const noNyokkiPlayerId of noNyokkiPlayerIds) {
      this.ownRankingBoard.changeNyokkiStatus(noNyokkiPlayerId, status)
      this.synchroBreakPluginStore.synchroBreakIcons.get(noNyokkiPlayerId)?.handlePlayerSynchroBreakIcons(-1, status)
    }

    const noNyokkiLogText = this.synchroBreakPluginStore.nyokkiLogTextCreator.createNoNyokkiLogText(noNyokkiPlayerIds)
    this.gamePluginStore.gameLogRenderer.gameLog(noNyokkiLogText, 100)
  }

  /**
   * 結果表示のハンドラー
   */
  private readonly handleSynchroBreakResult = (ev: SynchroBreakResultEvent): void => {
    this.resultHandlers[ev.resultScreenType]()
  }

  /**
   * 結果ウィンドウタイプ別のハンドラー
   */
  private readonly resultHandlers: Record<ResultScreenType, () => void> = {
    [RESULT_SCREEN_TYPES.TURN]: () => {
      this.showResult(RESULT_SCREEN_TYPES.TURN)
    },
    [RESULT_SCREEN_TYPES.FINAL]: () => {
      this.ownRankingBoard.remove()
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'nyokkiButton')?.remove()
      this.descriptionWindow.displayResultMessage()
      this.showResult(RESULT_SCREEN_TYPES.FINAL)
    },
  }

  /**
   * 結果画面を表示
   */
  private showResult(type: ResultScreenType): void {
    const resultScreen = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'resultScreen')
    if (resultScreen === undefined) throw new SynchroBreakUiNotFoundError('resultScreen')

    resultScreen.createResultRanking(type)
  }

  /**
   * ターンが開始した際の処理
   */
  private readonly synchroBreakTurnStart = (ev: SynchroBreakTurnStartEvent): void => {
    this.resetPlayerNyokkiIcon()
    this.removeBetCoinUi()
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'resultScreen')?.close()
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownCoins = this.synchroBreakPluginStore.playersCoinRepository.get(ownPlayerId)

    const gameTurn = this.synchroBreakPluginStore.gameTurn
    if (gameTurn === undefined) throw new SynchroBreakPluginError('ターン情報が存在しません')

    const turnLeft = gameTurn - ev.turnNumber + 1
    this.displayBetTimer()
    this.descriptionWindow.displayTurnStart(turnLeft, ownCoins)
    this.betCoinFormContainer.open()
  }

  /**
   * プレイヤーのコイン所持数が更新された際の処理
   */
  private readonly updatePlayersCoin = (ev: UpdatePlayersCoinEvent): void => {
    for (const playerCoin of ev.playersCoin) {
      this.synchroBreakPluginStore.playersCoinRepository.set(playerCoin.playerId, playerCoin.coins)
    }
    this.ownRankingBoard.updateRanking()
  }

  /**
   * ゲームの説明ウィンドウを取得する
   */
  private get descriptionWindow(): IDescriptionWindow {
    const descriptionWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'descriptionWindow')
    if (descriptionWindow === undefined) throw new SynchroBreakUiNotFoundError('descriptionWindow')
    return descriptionWindow
  }

  /**
   * シンクロブレイクのランキングボードを取得する
   */
  private get ownRankingBoard(): IOwnRankingBoard {
    const ownRankingBoard = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'ownRankingBoard')
    if (ownRankingBoard === undefined) throw new SynchroBreakUiNotFoundError('ownRankingBoard')
    return ownRankingBoard
  }

  private get betCoinFormContainer(): IBetCoinFormContainer {
    const betCoinFormContainer = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'betCoinConfirm')
    if (betCoinFormContainer === undefined) throw new SynchroBreakUiNotFoundError('betCoinFormContainer')
    return betCoinFormContainer
  }

  private get betTimer(): IBetTimer {
    const betTimer = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'betTimer')
    if (betTimer === undefined) throw new SynchroBreakUiNotFoundError('betTimer')
    return betTimer
  }

  private displayBetTimer(): void {
    this.betTimer.open()
    this.descriptionWindow.element.appendChild(this.betTimer.element)
  }

  /**
   * カウントダウンバーを表示する
   */
  private displayCountdownBar(): void {
    this.countdownBar.reset()

    const timeLimit = this.synchroBreakPluginStore.timeLimit
    if (timeLimit !== undefined) {
      this.countdownBar.setTotalDuration(timeLimit)
    }

    if (this.countdownBar.element.parentElement !== this.descriptionWindow.element) {
      this.descriptionWindow.element.appendChild(this.countdownBar.element)
    }

    this.countdownBar.open()
  }

  /**
   * カウントダウンバーを取得する
   */
  private get countdownBar(): ICountdownBar {
    const countdownBar = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'countdownBar')
    if (countdownBar === undefined) throw new SynchroBreakUiNotFoundError('countdownBar')
    return countdownBar
  }

  /**
   * プレイヤーの周囲のアイコンを削除する
   */
  private removeSynchroBreakIcons(): void {
    this.resetPlayerNyokkiIcon()
    this.removeBetCoinUi()
  }

  /**
   * ベットコインのUIを削除する
   */
  private removeBetCoinUi(): void {
    for (const playerId of this.coinViewerIconUis.keys()) {
      const coinViewerIcon = this.coinViewerIconUis.get(playerId)
      coinViewerIcon?.coinViewer?.removeBetUi()
    }
  }

  /**
   * ニョッキアクションのニョッキステータスアイコンをリセットする
   */
  private resetPlayerNyokkiIcon(): void {
    if (this.synchroBreakPluginStore.synchroBreakIcons === undefined) return
    this.synchroBreakPluginStore.synchroBreakIcons.forEach((value) => {
      value.resetStatusIcon()
    })
  }
}

declare module '@churaverse/game-plugin-client' {
  export interface GameIdsMap {
    synchroBreak: SynchroBreakPlugin
  }
}
