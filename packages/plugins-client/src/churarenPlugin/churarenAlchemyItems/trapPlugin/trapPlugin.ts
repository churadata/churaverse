import type { UseAlchemyItemEvent } from '@churaverse/churaren-alchemy-plugin-client'
import { BaseAlchemyItemPlugin, ClearAlchemyItemBoxEvent } from '@churaverse/churaren-alchemy-plugin-client'
import type { NetworkPluginStore, Sendable } from '@churaverse/network-plugin-client'
import type { PlayerPluginStore } from '@churaverse/player-plugin-client'
import {
  type EntityDespawnEvent,
  type EntitySpawnEvent,
  type IMainScene,
  type PhaserLoadAssets,
  type PhaserSceneInit,
  Position,
  uniqueId,
  type Vector,
} from 'churaverse-engine-client'
import { SocketController } from './controller/socketController'
import { TRAP_ITEM, Trap } from './domain/trap'
import { TrapSpawnMessage } from './message/trapSpawnMessage'
import { TrapAttackRenderer } from './renderer/trapAttackRenderer'
import { TrapAttackRendererFactory } from './renderer/trapAttackRendererFactory'
import type { TrapPluginStore } from './store/defTrapPluginStore'
import { initTrapPluginStore, resetTrapPluginStore } from './store/initTrapPluginStore'

export class TrapPlugin extends BaseAlchemyItemPlugin {
  private attackRendererFactory?: TrapAttackRendererFactory
  private trapPluginStore!: TrapPluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItem = TRAP_ITEM

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))

    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupRegisterMessageListener.bind(this.socketController)
    )
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.attackRendererFactory = new TrapAttackRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    TrapAttackRenderer.loadAssets(ev.scene)
  }

  private init(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.subscribeEvent('entitySpawn', this.spawnTrap)
    this.bus.subscribeEvent('entityDespawn', this.dieTrap)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnTrap)
    this.bus.unsubscribeEvent('entityDespawn', this.dieTrap)
  }

  protected handleGameStart(): void {
    initTrapPluginStore(this.store, this.attackRendererFactory)
    this.trapPluginStore = this.store.of('churarenTrapPlugin')
    this.socketController?.getStores()
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
    this.clearTrap()
    resetTrapPluginStore(this.store)
  }

  protected handleMidwayJoin(): void {
    this.unsubscribeGameEvent()
  }

  // 錬金アイテムを使用した時の処理
  protected useAlchemyItem = (ev: UseAlchemyItemEvent): void => {
    if (ev.alchemyItem.kind !== 'trap') return

    const startPos = ev.ownPlayer.position.copy()
    const renderer = this.trapPluginStore.trapAttackRendererFactory.build()
    if (renderer == null) return
    const position = new Position(startPos.x, startPos.y)

    const trap = new Trap(uniqueId(), ev.ownPlayer.id, position, ev.ownPlayer.direction, Date.now())

    this.trapPluginStore.traps.set(trap.trapId, trap)
    this.trapPluginStore.trapAttackRenderers.set(trap.trapId, renderer)

    // 他のプレイヤーにトラップの出現を送信する
    if (trap.churarenWeaponOwnerId === this.playerPluginStore.ownPlayerId) {
      this.networkStore.messageSender.send(
        new TrapSpawnMessage({
          trapId: trap.trapId,
          startPos: trap.position.toVector() as Vector & Sendable,
          direction: trap.direction,
          spawnTime: Date.now(),
        })
      )
    }
    renderer.spawn(trap.position)

    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(ev.ownPlayer.id)
    this.bus.post(clearAlchemyItemBoxEvent)
  }

  // トラップの出現を受信した時の処理
  private readonly spawnTrap = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof Trap)) return

    const trap = ev.entity
    const renderer = this.trapPluginStore.trapAttackRendererFactory.build()
    if (renderer == null) return

    this.trapPluginStore.traps.set(trap.trapId, trap)
    this.trapPluginStore.trapAttackRenderers.set(trap.trapId, renderer)

    renderer.spawn(trap.position)
  }

  private readonly dieTrap = (ev: EntityDespawnEvent): void => {
    if (!(ev.entity instanceof Trap)) return
    const trapId = ev.entity.trapId
    const trap = this.trapPluginStore.traps.get(trapId)
    const trapAttackRenderer = this.trapPluginStore.trapAttackRenderers.get(trapId)
    trapAttackRenderer?.collide()
    trap?.die()
    this.trapPluginStore.traps.delete(trapId)
    this.trapPluginStore.trapAttackRenderers.delete(trapId)
  }

  private clearTrap(): void {
    this.trapPluginStore.trapAttackRenderers.forEach((renderer) => {
      renderer.collide()
    })
    this.trapPluginStore.trapAttackRenderers.clear()
    this.trapPluginStore.traps.clear()
  }
}
