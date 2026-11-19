import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server'
import type { Boss } from '@churaverse/churaren-boss-plugin-server'
import type { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server'
import type { MapPluginStore } from '@churaverse/map-plugin-server'
import type { NetworkPluginStore } from '@churaverse/network-plugin-server'
import { type EntitySpawnEvent, type IMainScene, LivingDamageEvent, type UpdateEvent } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { ICE_ARROW_ITEM, IceArrow } from './domain/iceArrow'
import { moveIceArrows, removeDieIceArrow } from './domain/iceArrowService'
import { IceArrowHitMessage } from './message/iceArrowHitMessage'
import type { IceArrowPluginStore } from './store/defIceArrowPluginStore'
import { initIceArrowPluginStore } from './store/initIceArrowPluginStore'
import '@churaverse/churaren-boss-plugin-server'
import { IceArrowDamageCause } from './domain/iceArrowDamageCause'

export class IceArrowPlugin extends BaseAlchemyItemPlugin {
  private iceArrowPluginStore!: IceArrowPluginStore
  private mapPluginStore!: MapPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItem = ICE_ARROW_ITEM

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
    initIceArrowPluginStore(this.store)
    this.mapPluginStore = this.store.of('mapPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.iceArrowPluginStore = this.store.of('iceArrowPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('entitySpawn', this.spawnIceArrow)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnIceArrow)
  }

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
  }

  private readonly update = (ev: UpdateEvent): void => {
    moveIceArrows(ev.dt, this.iceArrowPluginStore.iceArrows, this.mapPluginStore.mapManager.currentMap)
    removeDieIceArrow(this.iceArrowPluginStore.iceArrows, (iceArrowId: string) => {
      const iceArrowHitMessage = new IceArrowHitMessage({ iceArrowId })
      this.networkPluginStore.messageSender.send(iceArrowHitMessage)
    })
  }

  private readonly spawnIceArrow = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof IceArrow)) return
    const iceArrow = ev.entity
    this.iceArrowPluginStore.iceArrows.set(iceArrow.iceArrowId, iceArrow)
    iceArrow.walk(this.mapPluginStore.mapManager.currentMap)
  }

  private registerOnOverlapBoss(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.iceArrowPluginStore.iceArrows,
      this.store.of('bossPlugin').bosses,
      this.iceArrowHit.bind(this)
    )
  }

  private iceArrowHit(iceArrow: IceArrow, boss: Boss): void {
    if (boss.isDead) return
    iceArrow.isDead = true

    const iceArrowDamageCause = new IceArrowDamageCause(iceArrow)
    const livingDamageEvent = new LivingDamageEvent(boss, iceArrowDamageCause, iceArrow.power)
    this.bus.post(livingDamageEvent)
  }
}
