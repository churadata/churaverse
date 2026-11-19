import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server'
import type { Boss } from '@churaverse/churaren-boss-plugin-server'
import type { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server'
import type { NetworkPluginStore } from '@churaverse/network-plugin-server'
import { type EntitySpawnEvent, type IMainScene, LivingDamageEvent, type UpdateEvent } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { BLACK_HOLE_ITEM, BlackHole } from './domain/blackHole'
import { moveBlackHoles, removeDieBlackHole } from './domain/blackHoleService'
import { BlackHoleDespawnMessage } from './message/blackHoleDespawnMessage'
import type { BlackHolePluginStore } from './store/defBlackHolePluginStore'
import { initBlackHolePluginStore } from './store/initBlackHolePluginStore'
import '@churaverse/churaren-boss-plugin-server'
import { BlackHoleDamageCause } from './domain/blackHoleDamageCause'

export class BlackHolePlugin extends BaseAlchemyItemPlugin {
  private blackHolePluginStore!: BlackHolePluginStore
  private networkPlugin!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItem = BLACK_HOLE_ITEM

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupRegisterMessageListener.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlap.bind(this))
  }

  private init(): void {
    initBlackHolePluginStore(this.store)
    this.blackHolePluginStore = this.store.of('churarenBlackHolePlugin')
    this.networkPlugin = this.store.of('networkPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('entitySpawn', this.spawnBlackHole)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnBlackHole)
  }

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
    this.blackHolePluginStore.blackHoles.clear()
  }

  private readonly update = (ev: UpdateEvent): void => {
    moveBlackHoles(ev.dt, this.blackHolePluginStore.blackHoles)
    removeDieBlackHole(this.blackHolePluginStore.blackHoles, (blackHoleId: string) => {
      const blackHoleDespawnMessage = new BlackHoleDespawnMessage({ blackHoleId })
      this.networkPlugin.messageSender.send(blackHoleDespawnMessage)
    })
  }

  private readonly spawnBlackHole = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof BlackHole)) return
    const blackHole = ev.entity
    this.blackHolePluginStore.blackHoles.set(blackHole.id, blackHole)
    blackHole.walk()
  }

  private registerOnOverlap(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.blackHolePluginStore.blackHoles,
      this.store.of('bossPlugin').bosses,
      this.blackHoleHitBoss.bind(this)
    )
  }

  private blackHoleHitBoss(blackHole: BlackHole, boss: Boss): void {
    if (boss.isDead) return
    blackHole.disableCollisionTemporarily()
    const blackHoleDamageCause = new BlackHoleDamageCause(blackHole)
    const livingDamageEvent = new LivingDamageEvent(boss, blackHoleDamageCause, blackHole.power)
    this.bus.post(livingDamageEvent)
  }
}
