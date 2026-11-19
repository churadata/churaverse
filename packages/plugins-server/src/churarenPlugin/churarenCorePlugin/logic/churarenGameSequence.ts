import type { GameIds, GamePluginStore } from '@churaverse/game-plugin-server'
import { DEFAULT_HP, type PlayerHealData, PlayerHealMessage } from '@churaverse/player-plugin-server'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { ChurarenResultEvent } from '../event/churarenResultEvent'
import { ChurarenStartCountdownEvent } from '../event/churarenStartCountdownEvent'
import { ChurarenStartTimerEvent } from '../event/churarenStartTimerEvent'
import type { IChurarenGameSequence } from '../interface/IChurarenGameSequence'

const COUNTDOWN_TIME_SECONDS = 3 // カウントダウン時間(秒)
export const TIME_LIMIT_MINUTES = 3 * 60 // 制限時間(分)

export class ChurarenGameSequence implements IChurarenGameSequence {
  private readonly gamePluginStore: GamePluginStore

  public constructor(
    private readonly gameId: GameIds,
    private readonly store: Store<IMainScene>,
    private readonly eventBus: IEventBus<IMainScene>
  ) {
    this.gamePluginStore = this.store.of('gamePlugin')
  }

  public async runSequence(): Promise<void> {
    await this.refillPlayersHp()
    if (!this.isActive) return
    await this.startCountdown()
    if (!this.isActive) return
    await this.startTimer()
    if (!this.isActive) return
    await this.handleTimeOver()
  }

  private async refillPlayersHp(): Promise<void> {
    this.gamePluginStore.games.get(this.gameId)?.joinedPlayerIds.forEach((id) => {
      const player = this.store.of('playerPlugin').players.get(id)
      if (player === undefined) return
      player.hp = DEFAULT_HP
      const playerHealData: PlayerHealData = {
        playerId: player.id,
        healAmount: DEFAULT_HP,
      }
      const playerHealMessage = new PlayerHealMessage(playerHealData)
      this.store.of('networkPlugin').messageSender.send(playerHealMessage)
    })
  }

  private async startCountdown(): Promise<void> {
    this.eventBus.post(new ChurarenStartCountdownEvent())
    for (let i = COUNTDOWN_TIME_SECONDS; i > 0; i--) {
      if (!this.isActive) return
      await this.delay(1000)
    }
  }

  private async startTimer(): Promise<void> {
    this.eventBus.post(new ChurarenStartTimerEvent())
    for (let i = TIME_LIMIT_MINUTES; i > 0; i--) {
      if (!this.isActive) return
      await this.delay(1000)
    }
  }

  private async handleTimeOver(): Promise<void> {
    this.eventBus.post(new ChurarenResultEvent('timeOver'))
  }

  private get isActive(): boolean {
    return this.gamePluginStore.games.get(this.gameId)?.isActive ?? false
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
}
