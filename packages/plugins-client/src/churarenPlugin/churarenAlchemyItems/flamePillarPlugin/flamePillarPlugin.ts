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
import { FLAME_PILLAR_ITEM, FlamePillar } from './domain/flamePillar'
import { FlamePillarSpawnMessage } from './message/flamePillarSpawnMessage'
import { FlamePillarAttackRenderer } from './renderer/flamePillarAttackRenderer'
import { FlamePillarAttackRendererFactory } from './renderer/flamePillarAttackRendererFactory'
import type { FlamePillarPluginStore } from './store/defFlamePillarPluginStore'
import { initFlamePillarPluginStore, resetFlamePillarPluginStore } from './store/initFlamePillarPluginStore'

export class FlamePillarPlugin extends BaseAlchemyItemPlugin {
  private attackRendererFactory?: FlamePillarAttackRendererFactory
  private playerPluginStore!: PlayerPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  private flamePillarPluginStore!: FlamePillarPluginStore
  protected alchemyItem = FLAME_PILLAR_ITEM

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
    this.attackRendererFactory = new FlamePillarAttackRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    FlamePillarAttackRenderer.loadAssets(ev.scene)
  }

  private init(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.subscribeEvent('entitySpawn', this.spawnFlamePillar)
    this.bus.subscribeEvent('entityDespawn', this.despawnFlamePillar)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnFlamePillar)
    this.bus.unsubscribeEvent('entityDespawn', this.despawnFlamePillar)
  }

  protected handleGameStart(): void {
    initFlamePillarPluginStore(this.store, this.attackRendererFactory)
    this.flamePillarPluginStore = this.store.of('churarenFlamePillarPlugin')
    this.socketController?.registerMessageListener()
    this.socketController?.getStores()
  }

  protected handleGameTermination(): void {
    resetFlamePillarPluginStore(this.store)
    this.socketController?.unregisterMessageListener()
  }

  protected handleMidwayJoin(): void {
    this.unsubscribeGameEvent()
  }

  protected useAlchemyItem = (ev: UseAlchemyItemEvent): void => {
    if (ev.alchemyItem.kind !== 'flamePillar') return

    const gap = 65
    const numFlamePillars = 10
    const startPos = ev.ownPlayer.position.copy()

    for (let i = 0; i < numFlamePillars; i++) {
      const renderer = this.flamePillarPluginStore.flamePillarAttackRendererFactory.build()
      if (renderer == null) return
      const offsetX = (Math.random() - 0.5) * 200 * 2
      const offsetY = (Math.random() - 0.5) * 200 * 2

      const position = new Position(
        startPos.x + gap * ev.ownPlayer.direction.x + offsetX,
        startPos.y + gap * ev.ownPlayer.direction.y + offsetY
      )

      const flamePillar = new FlamePillar(uniqueId(), ev.ownPlayer.id, position, ev.ownPlayer.direction, Date.now())

      this.flamePillarPluginStore.flamePillars.set(flamePillar.flamePillarId, flamePillar)
      this.flamePillarPluginStore.flamePillarAttackRenderers.set(flamePillar.flamePillarId, renderer)

      // 他のプレイヤーに炎の柱の出現を送信する
      if (flamePillar.churarenWeaponOwnerId === this.playerPluginStore.ownPlayerId) {
        this.networkPluginStore.messageSender.send(
          new FlamePillarSpawnMessage({
            flamePillarId: flamePillar.flamePillarId,
            startPos: flamePillar.position.toVector() as Vector & Sendable,
            direction: flamePillar.direction,
            spawnTime: flamePillar.spawnTime,
          })
        )
      }
      renderer.spawn(flamePillar.position)
    }

    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(ev.ownPlayer.id)
    this.bus.post(clearAlchemyItemBoxEvent)
  }

  private readonly spawnFlamePillar = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof FlamePillar)) return
    if (ev.entity.churarenWeaponOwnerId === this.playerPluginStore.ownPlayerId) return
    const flamePillar = ev.entity
    const renderer = this.flamePillarPluginStore.flamePillarAttackRendererFactory.build()
    this.flamePillarPluginStore.flamePillars.set(flamePillar.flamePillarId, flamePillar)
    this.flamePillarPluginStore.flamePillarAttackRenderers.set(flamePillar.flamePillarId, renderer)
  }

  private readonly despawnFlamePillar = (ev: EntityDespawnEvent): void => {
    if (!(ev.entity instanceof FlamePillar)) return
    const flamePillarId = ev.entity.flamePillarId
    const flamePillar = this.flamePillarPluginStore.flamePillars.get(flamePillarId)
    const flamePillarAttackRenderer = this.flamePillarPluginStore.flamePillarAttackRenderers.get(flamePillarId)
    flamePillar?.die()
    flamePillarAttackRenderer?.dead()
    this.flamePillarPluginStore.flamePillars.delete(flamePillarId)
  }
}
