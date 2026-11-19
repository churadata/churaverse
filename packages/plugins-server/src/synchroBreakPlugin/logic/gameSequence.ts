import type { NetworkPluginStore } from '@churaverse/network-plugin-server'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import '@churaverse/player-plugin-server'
import type { GameIds, GamePluginStore } from '@churaverse/game-plugin-server'
import { SynchroBreakTurnEndEvent } from '../event/synchroBreakTurnEndEvent'
import { SynchroBreakTurnStartEvent } from '../event/synchroBreakTurnStartEvent'
import type { IGameSequence } from '../interface/IGameSequence'
import { BetTimeRemainingMessage } from '../message/betTimeRemainingMessage'
import { SynchroBreakResultMessage } from '../message/synchroBreakResultMessage'
import { SynchroBreakStartCountMessage } from '../message/synchroBreakStartCountMessage'
import { SynchroBreakTurnTimerMessage } from '../message/synchroBreakTurnTimerMessage'
import { UpdatePlayersCoinMessage } from '../message/updatePlayersCoinMessage'
import type { SynchroBreakPluginStore } from '../store/defSynchroBreakPluginStore'
import { BET_TIMER_TIME_LIMIT, SYNCHRO_BREAK_MID_RESULT_TIME_LIMIT } from '../synchroBreakPlugin'
import { RESULT_SCREEN_TYPES } from '../type/resultScreenType'

/** ベット残り時間・ニョッキ受付タイマーで共通のポーリング間隔(ミリ秒) */
const POLLING_INTERVAL_MS = 100

export class GameSequence implements IGameSequence {
  private readonly synchroBreakPluginStore!: SynchroBreakPluginStore
  private readonly gamePluginStore: GamePluginStore
  private readonly networkPluginStore: NetworkPluginStore<IMainScene>
  private turnCountNumber: number = 1

  public constructor(
    private readonly gameId: GameIds,
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly store: Store<IMainScene>
  ) {
    this.synchroBreakPluginStore = this.store.of('synchroBreakPlugin')
    this.gamePluginStore = this.store.of('gamePlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  public async processTurnSequence(): Promise<void> {
    if (!this.isActive) return
    await this.startBetTimeCountdown()
    if (!this.isActive) return
    await this.startTurnCountdown()
    if (!this.isActive) return
    await this.startTurnTimer()
    if (!this.isActive) return
    await this.finishTurn()
  }

  /**
   * ターン開始前の3秒カウントダウンを実行
   */
  private async startTurnCountdown(): Promise<void> {
    if (!this.isActive) return

    // 最後にベットしたプレイヤーにも説明ウィンドウが表示されるように、1秒待機
    await this.delay(1000)

    for (let remainingSeconds = 3; remainingSeconds > 0; remainingSeconds--) {
      if (!this.isActive) return
      const synchroBreakStartCountMessage = new SynchroBreakStartCountMessage({ remainingSeconds })
      this.networkPluginStore.messageSender.send(synchroBreakStartCountMessage)

      await this.delay(1000)
    }
  }

  /**
   * ターンの制限時間をカウントダウン
   */
  private async startTurnTimer(): Promise<void> {
    if (!this.isActive) return
    const turnTimer = this.synchroBreakPluginStore.timeLimit
    if (turnTimer === undefined) return

    // ベット受付中・カウントダウン中に送られたニョッキを無効化し、受付フェーズ開始時点から数え直す
    this.synchroBreakPluginStore.nyokkiRepository.clear()

    for (let remainingMs = turnTimer * 1000; remainingMs > 0; remainingMs -= POLLING_INTERVAL_MS) {
      if (!this.isActive) return
      // 全プレイヤーがニョッキした場合はターンを即座に終了
      if (this.isAllPlayersNyokkiDone()) return

      if (remainingMs % 1000 === 0) {
        const turnTimerMessage = new SynchroBreakTurnTimerMessage({ remainingSeconds: remainingMs / 1000 })
        this.networkPluginStore.messageSender.send(turnTimerMessage)
      }

      await this.delay(POLLING_INTERVAL_MS)
    }
  }

  /**
   * 参加している全プレイヤーのニョッキの成否が確定したかを判定する
   * 同時押し判定中のプレイヤーがいる間は完了扱いにしない
   */
  private isAllPlayersNyokkiDone(): boolean {
    const numOfPlayers = this.gamePluginStore.games.get(this.gameId)?.joinedPlayerIds.length ?? 0
    const resolvedNyokkiPlayerCount = this.synchroBreakPluginStore.nyokkiRepository.getResolvedNyokkiPlayerCount()
    return numOfPlayers > 0 && numOfPlayers - resolvedNyokkiPlayerCount <= 0
  }

  /**
   * ターン終了時の処理を実行し、次ターンが終了かを判定する。
   */
  private async finishTurn(): Promise<void> {
    const turnSelect = this.synchroBreakPluginStore.turnSelect
    if (turnSelect === undefined) return

    const synchroBreakTurnEnd = new SynchroBreakTurnEndEvent()
    this.eventBus.post(synchroBreakTurnEnd)

    // ニョッキしなかったプレイヤーのFBを与えるため、1秒待機
    await this.delay(1000)

    if (!this.isActive || turnSelect === undefined) return
    if (turnSelect <= this.turnCountNumber) {
      this.turnCountNumber = 1
      this.sendSortedPlayersCoin()
      this.networkPluginStore.messageSender.send(
        new SynchroBreakResultMessage({ resultScreenType: RESULT_SCREEN_TYPES.FINAL })
      )
    } else {
      this.turnCountNumber++

      this.sendSortedPlayersCoin()
      this.networkPluginStore.messageSender.send(
        new SynchroBreakResultMessage({ resultScreenType: RESULT_SCREEN_TYPES.TURN })
      )

      await this.delay(SYNCHRO_BREAK_MID_RESULT_TIME_LIMIT)

      if (!this.isActive) return
      const synchroBreakTurnStart = new SynchroBreakTurnStartEvent(this.turnCountNumber)
      this.eventBus.post(synchroBreakTurnStart)
    }
  }

  /**
   * ソート済みのプレイヤーコイン情報を送信
   */
  private sendSortedPlayersCoin(): void {
    const sortedPlayersCoin = this.synchroBreakPluginStore.playersCoinRepository.sortedPlayerCoins()
    this.networkPluginStore.messageSender.send(new UpdatePlayersCoinMessage({ playersCoin: sortedPlayersCoin }))
  }

  /**
   * ベットタイムのカウントダウンを実行し、残り時間を通知する処理
   */
  private async startBetTimeCountdown(): Promise<void> {
    let remainingTime = BET_TIMER_TIME_LIMIT

    // 100ミリ秒ごとに残り時間を通知
    while (remainingTime >= 0 && this.isActive) {
      // 全プレイヤーがベットした場合は終了
      const numOfPlayers = this.gamePluginStore.games.get(this.gameId)?.joinedPlayerIds.length ?? 0
      const didBetPlayers = this.synchroBreakPluginStore.betCoinRepository.getBetCoinPlayerCount()
      if (numOfPlayers - didBetPlayers <= 0) {
        return
      }

      remainingTime -= POLLING_INTERVAL_MS
      const betTimeRemainingMessage = new BetTimeRemainingMessage({ remainingTime })
      this.networkPluginStore.messageSender.send(betTimeRemainingMessage)
      await this.delay(POLLING_INTERVAL_MS)
    }

    await this.delay(POLLING_INTERVAL_MS)
  }

  private get isActive(): boolean {
    return this.gamePluginStore.games.get(this.gameId)?.isActive ?? false
  }

  /**
   * 待機処理を行うためのヘルパー関数
   */
  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
}
