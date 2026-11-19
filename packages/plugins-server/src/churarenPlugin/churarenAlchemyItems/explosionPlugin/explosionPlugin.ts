import type { Boss } from '@churaverse/churaren-boss-plugin-server'
import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import type { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server'
import type { MapPluginStore } from '@churaverse/map-plugin-server'
import type { NetworkPluginStore } from '@churaverse/network-plugin-server'
import { type EntitySpawnEvent, type IMainScene, LivingDamageEvent, type UpdateEvent } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { EXPLOSION_ITEM, Explosion } from './domain/explosion'
import { moveExplosions, removeDieExplosion } from './domain/explosionService'
import { ExplosionHitMessage } from './message/explosionHitMessage'
import type { ExplosionPluginStore } from './store/defExplosionPluginStore'
import { initExplosionPluginStore } from './store/initExplosionPluginStore'
import '@churaverse/churaren-boss-plugin-server'
import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server'
import { ExplosionDamageCause } from './domain/explosionDamageCause'

export class ExplosionPlugin extends BaseAlchemyItemPlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private explosionPluginStore!: ExplosionPluginStore
  private mapPluginStore!: MapPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItem = EXPLOSION_ITEM

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

  private init(): void {
    initExplosionPluginStore(this.store)
    this.mapPluginStore = this.store.of('mapPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.explosionPluginStore = this.store.of('explosionPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('entitySpawn', this.spawnExplosion)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnExplosion)
  }

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
  }

  private readonly update = (ev: UpdateEvent): void => {
    moveExplosions(ev.dt, this.explosionPluginStore.explosions, this.mapPluginStore.mapManager.currentMap)
    removeDieExplosion(this.explosionPluginStore.explosions, (explosionId: string) => {
      const explosionHitMessage = new ExplosionHitMessage({ explosionId })
      this.networkPluginStore.messageSender.send(explosionHitMessage)
    })
  }

  private readonly spawnExplosion = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof Explosion)) return
    const explosion = ev.entity
    this.explosionPluginStore.explosions.set(explosion.explosionId, explosion)
    explosion.walk(this.mapPluginStore.mapManager.currentMap)
  }

  private registerOnOverlapBoss(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.explosionPluginStore.explosions,
      this.store.of('bossPlugin').bosses,
      this.explosionHit.bind(this)
    )
  }

  private explosionHit(explosion: Explosion, boss: Boss): void {
    if (boss.isDead) return
    explosion.isDead = true

    const explosionDamageCause = new ExplosionDamageCause(explosion)
    const livingDamageEvent = new LivingDamageEvent(boss, explosionDamageCause, explosion.power)
    this.bus.post(livingDamageEvent)
  }
}
