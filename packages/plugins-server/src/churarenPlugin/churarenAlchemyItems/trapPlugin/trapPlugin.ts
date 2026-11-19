import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server'
import type { Boss } from '@churaverse/churaren-boss-plugin-server'
import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import type { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server'
import type { NetworkPluginStore } from '@churaverse/network-plugin-server'
import { type EntitySpawnEvent, type IMainScene, LivingDamageEvent } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { TRAP_ITEM, Trap } from './domain/trap'
import { TrapDamageCause } from './domain/trapDamageCause'
import { TrapHitMessage } from './message/trapHitMessage'
import type { TrapPluginStore } from './store/defTrapPluginStore'
import { initTrapPluginStore } from './store/initTrapPluginStore'
import '@churaverse/churaren-boss-plugin-server'
import '@churaverse/churaren-core-plugin-server'

export class TrapPlugin extends BaseAlchemyItemPlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private trapPluginStore!: TrapPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItem = TRAP_ITEM

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
    initTrapPluginStore(this.store)
    this.networkPluginStore = this.store.of('networkPlugin')
    this.trapPluginStore = this.store.of('trapPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('entitySpawn', this.spawnTrap)
    this.bus.subscribeEvent('churarenResult', this.removeAllTrap)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('entitySpawn', this.spawnTrap)
    this.bus.unsubscribeEvent('churarenResult', this.removeAllTrap)
  }

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
    this.removeAllTrap()
  }

  private readonly spawnTrap = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof Trap)) return
    const trap = ev.entity
    this.trapPluginStore.traps.set(trap.trapId, trap)
  }

  private readonly removeAllTrap = (): void => {
    const trapIds = this.trapPluginStore.traps.getAllId()
    trapIds.forEach((trapId) => {
      this.trapPluginStore.traps.delete(trapId)
      const trapHitMessage = new TrapHitMessage({ trapId })
      this.networkPluginStore.messageSender.send(trapHitMessage)
    })
  }

  private registerOnOverlapBoss(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.trapPluginStore.traps,
      this.store.of('bossPlugin').bosses,
      this.trapHit.bind(this)
    )
  }

  private trapHit(trap: Trap, boss: Boss): void {
    if (boss.isDead) return
    trap.die()
    // トラップ発動イベントの発火
    const trapDamageCause = new TrapDamageCause(trap)
    const livingDamageEvent = new LivingDamageEvent(boss, trapDamageCause, trap.power)
    this.bus.post(livingDamageEvent)
    this.trapPluginStore.traps.delete(trap.trapId)
    const trapHitMessage = new TrapHitMessage({ trapId: trap.trapId })
    this.networkPluginStore.messageSender.send(trapHitMessage)
  }
}
