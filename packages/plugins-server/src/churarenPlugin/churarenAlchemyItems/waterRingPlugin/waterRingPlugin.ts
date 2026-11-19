import type { Boss } from '@churaverse/churaren-boss-plugin-server'
import type { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server'
import type { NetworkPluginStore } from '@churaverse/network-plugin-server'
import type { PlayerPluginStore, PlayerWalkEvent } from '@churaverse/player-plugin-server'
import {
  type EntitySpawnEvent,
  type IMainScene,
  type InitEvent,
  LivingDamageEvent,
  type UpdateEvent,
} from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { WATER_RING_ITEM, WaterRing } from './domain/waterRing'
import { removeDieWaterRing } from './domain/waterRingService'
import { WaterRingDespawnMessage } from './message/waterRingDespawnMessage'
import type { WaterRingPluginStore } from './store/defWaterRingPluginStore'
import { initWaterRingPluginStore } from './store/initWaterRingPluginStore'
import '@churaverse/churaren-boss-plugin-server'
import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server'
import { WaterRingDamageCause } from './domain/waterRingDamageCause'

export class WaterRingPlugin extends BaseAlchemyItemPlugin {
  private waterRingPluginStore!: WaterRingPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private playerPluginStore!: PlayerPluginStore
  private socketController?: SocketController
  protected alchemyItem = WATER_RING_ITEM

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupRegisterMessageListener.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlapBoss.bind(this))
  }

  private init(_ev: InitEvent): void {
    initWaterRingPluginStore(this.store)
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.waterRingPluginStore = this.store.of('waterRingPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('entitySpawn', this.spawnWaterRing)
    this.bus.subscribeEvent('playerWalk', this.onPlayerWalk)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnWaterRing)
    this.bus.unsubscribeEvent('playerWalk', this.onPlayerWalk)
  }

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
    this.removeAllWaterRing()
  }

  private readonly update = (_ev: UpdateEvent): void => {
    // クールダウン更新
    this.waterRingPluginStore.waterRings.getAllId().forEach((waterRingId) => {
      const waterRing = this.waterRingPluginStore.waterRings.get(waterRingId)
      waterRing?.updateCooldown()
    })

    removeDieWaterRing(this.waterRingPluginStore.waterRings, (waterRingId: string) => {
      const waterRingDespawnMessage = new WaterRingDespawnMessage({ waterRingId })
      this.networkPluginStore.messageSender.send(waterRingDespawnMessage)
    })
  }

  private readonly onPlayerWalk = (ev: PlayerWalkEvent): void => {
    const player = this.playerPluginStore.players.get(ev.id)
    if (player == null) return

    const gap = 40

    // プレイヤーのIDに対応するWaterRingを取得
    const waterRing = this.waterRingPluginStore.waterRings.getByOwnerId(player.id)
    if (waterRing == null) return

    // WaterRingの位置をプレイヤーの位置に更新
    waterRing.position.x = player.position.x + player.direction.x * gap
    waterRing.position.y = player.position.y + player.direction.y * gap
  }

  private readonly spawnWaterRing = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof WaterRing)) return
    const waterRing = ev.entity
    this.waterRingPluginStore.waterRings.set(waterRing.waterRingId, waterRing)
  }

  private removeAllWaterRing(): void {
    this.waterRingPluginStore.waterRings.getAllId().forEach((waterRingId) => {
      const waterRing = this.waterRingPluginStore.waterRings.get(waterRingId)
      waterRing?.die()
    })
  }

  private registerOnOverlapBoss(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.waterRingPluginStore.waterRings,
      this.store.of('bossPlugin').bosses,
      this.waterRingHit.bind(this)
    )
  }

  private waterRingHit(waterRing: WaterRing, boss: Boss): void {
    if (boss.isDead) return
    if (!waterRing.isCollidable) return

    // 衝突イベントの発火
    const waterRingDamageCause = new WaterRingDamageCause(waterRing)
    const livingDamageEvent = new LivingDamageEvent(boss, waterRingDamageCause, waterRing.power)
    this.bus.post(livingDamageEvent)

    // 衝突を記録し、クールダウンを開始
    waterRing.startCooldown()
  }
}
