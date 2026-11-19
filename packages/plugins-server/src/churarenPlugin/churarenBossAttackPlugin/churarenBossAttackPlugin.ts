import type { BossAttackRequestEvent } from '@churaverse/churaren-boss-plugin-server'
import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import type { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server'
import type { IGameInfo } from '@churaverse/game-plugin-server'
import { BaseGamePlugin } from '@churaverse/game-plugin-server'
import type { MapPluginStore } from '@churaverse/map-plugin-server'
import type { Player } from '@churaverse/player-plugin-server'
import { type EntitySpawnEvent, LivingDamageEvent, type UpdateEvent } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { BossAttack } from './domain/bossAttack'
import { BossAttackDamageCause } from './domain/bossAttackDamageCause'
import { moveBossAttacks, removeDieBossAttack, sendSpawnedBossAttack } from './domain/bossAttackService'
import { BossAttackHitMessage } from './message/bossAttackHitMessage'
import type { BossAttackPluginStore } from './store/defBossAttackPluginStore'
import { initBossAttackPluginStore } from './store/initBossAttackPluginStore'
import '@churaverse/churaren-core-plugin-server'
import '@churaverse/player-plugin-server'
import '@churaverse/churaren-boss-plugin-server'
import '@churaverse/network-plugin-server'

export class ChurarenBossAttackPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private churarenGameInfo?: IGameInfo
  private bossAttackPluginStore!: BossAttackPluginStore
  private mapPluginStore!: MapPluginStore
  private socketController?: SocketController

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlap.bind(this))
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('bossAttackRequest', this.generateBossAttack)
    this.bus.subscribeEvent('entitySpawn', this.onSpawnBossAttack)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('bossAttackRequest', this.generateBossAttack)
    this.bus.unsubscribeEvent('entitySpawn', this.onSpawnBossAttack)
  }

  protected handleGameStart(): void {
    this.churarenGameInfo = this.store.of('gamePlugin').games.get(this.gameId)
  }

  protected handleGameTermination(): void {
    this.bossAttackPluginStore.bossAttacks.clear()
  }

  private readonly update = (ev: UpdateEvent): void => {
    moveBossAttacks(ev.dt, this.bossAttackPluginStore.bossAttacks, this.mapPluginStore.mapManager.currentMap)
    removeDieBossAttack(this.bossAttackPluginStore.bossAttacks, (bossAttackId: string) => {
      const bossAttackHitMessage = new BossAttackHitMessage({ bossAttackId })
      const networkPluginStore = this.store.of('networkPlugin')
      networkPluginStore.messageSender.send(bossAttackHitMessage)
    })
  }

  private init(): void {
    initBossAttackPluginStore(this.store)
    this.bossAttackPluginStore = this.store.of('bossAttackPlugin')
    this.mapPluginStore = this.store.of('mapPlugin')
  }

  private readonly generateBossAttack = (ev: BossAttackRequestEvent): void => {
    const boss = this.store.of('bossPlugin').bosses.get(ev.bossId)
    const churarenGameInfo = this.store.of('gamePlugin').games.get(this.gameId)
    const networkPluginStore = this.store.of('networkPlugin')
    if (churarenGameInfo === undefined || boss === undefined) return

    // ボスの攻撃をフロントに送信
    sendSpawnedBossAttack(networkPluginStore.messageSender, this.bus, boss.position, boss.bossId)
  }

  private registerOnOverlap(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.bossAttackPluginStore.bossAttacks,
      this.store.of('playerPlugin').players,
      this.bossAttackHitPlayer.bind(this)
    )
  }

  private readonly onSpawnBossAttack = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof BossAttack)) return
    const bossAttack = ev.entity
    this.bossAttackPluginStore.bossAttacks.set(bossAttack.bossAttackId, bossAttack)
    bossAttack.ignition(this.mapPluginStore.mapManager.currentMap)
  }

  private bossAttackHitPlayer(bossAttack: BossAttack, player: Player): void {
    if (player.isDead) return
    if (!bossAttack.isCollidable) return
    if (this.churarenGameInfo === undefined || !this.churarenGameInfo.joinedPlayerIds.includes(player.id)) return
    // ボス攻撃とプレイヤー衝突イベントの発火
    const bossAttackDamageCause = new BossAttackDamageCause(bossAttack)
    const livingDamageEvent = new LivingDamageEvent(player, bossAttackDamageCause, bossAttack.power)
    this.bus.post(livingDamageEvent)
    bossAttack.isDead = true
    bossAttack.isCollidable = false
  }
}
