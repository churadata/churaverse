import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server'
import type { Boss } from '@churaverse/churaren-boss-plugin-server'
import type { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server'
import type { MapPluginStore } from '@churaverse/map-plugin-server'
import type { NetworkPluginStore } from '@churaverse/network-plugin-server'
import { type EntitySpawnEvent, type IMainScene, LivingDamageEvent, type UpdateEvent } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { TORNADO_ITEM, Tornado } from './domain/tornado'
import { TornadoDamageCause } from './domain/tornadoDamageCause'
import { moveTornados, removeDieTornado } from './domain/tornadoService'
import { TornadoHitMessage } from './message/tornadoHitMessage'
import type { TornadoPluginStore } from './store/defTornadoPluginStore'
import { initTornadoPluginStore } from './store/initTornadoPluginStore'
import '@churaverse/churaren-boss-plugin-server'

export class TornadoPlugin extends BaseAlchemyItemPlugin {
  private tornadoPluginStore!: TornadoPluginStore
  private mapPluginStore!: MapPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItem = TORNADO_ITEM

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('update', this.update.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupRegisterMessageListener.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlapBoss.bind(this))
  }

  private init(): void {
    initTornadoPluginStore(this.store)
    this.tornadoPluginStore = this.store.of('tornadoPlugin')
    this.mapPluginStore = this.store.of('mapPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('entitySpawn', this.spawnTornado)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnTornado)
  }

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
  }

  private readonly update = (ev: UpdateEvent): void => {
    moveTornados(ev.dt, this.tornadoPluginStore.tornados, this.mapPluginStore.mapManager.currentMap)
    removeDieTornado(this.tornadoPluginStore.tornados, (tornadoId: string) => {
      const tornadoHitMessage = new TornadoHitMessage({ tornadoId })
      this.networkPluginStore.messageSender.send(tornadoHitMessage)
    })
  }

  private readonly spawnTornado = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof Tornado)) return
    const tornado = ev.entity
    this.tornadoPluginStore.tornados.set(tornado.tornadoId, tornado)
    tornado.walk(this.mapPluginStore.mapManager.currentMap)
  }

  private registerOnOverlapBoss(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.tornadoPluginStore.tornados,
      this.store.of('bossPlugin').bosses,
      this.tornadoHit.bind(this)
    )
  }

  private tornadoHit(tornado: Tornado, boss: Boss): void {
    if (boss.isDead) return
    tornado.isDead = true

    const tornadoDamageCause = new TornadoDamageCause(tornado)
    const livingDamageEvent = new LivingDamageEvent(boss, tornadoDamageCause, tornado.power)
    this.bus.post(livingDamageEvent)
  }
}
