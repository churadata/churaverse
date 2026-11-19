import type { UseAlchemyItemEvent } from '@churaverse/churaren-alchemy-plugin-client'
import { BaseAlchemyItemPlugin, ClearAlchemyItemBoxEvent } from '@churaverse/churaren-alchemy-plugin-client'
import type { NetworkPluginStore, Sendable } from '@churaverse/network-plugin-client'
import type { PlayerDieEvent, PlayerPluginStore, PlayerWalkEvent } from '@churaverse/player-plugin-client'
import { GRID_WALK_DURATION_MS } from '@churaverse/player-plugin-client'
import {
  type EntityDespawnEvent,
  type EntitySpawnEvent,
  GRID_SIZE,
  type IMainScene,
  type PhaserLoadAssets,
  type PhaserSceneInit,
  Position,
  uniqueId,
  type Vector,
} from 'churaverse-engine-client'
import { SocketController } from './controller/socketController'
import { WATER_RING_ITEM, WaterRing } from './domain/waterRing'
import { WaterRingSpawnMessage } from './message/waterRingSpawnMessage'
import { WaterRingAttackRenderer } from './renderer/waterRingAttackRenderer'
import { WaterRingAttackRendererFactory } from './renderer/waterRingAttackRendererFactory'
import type { WaterRingPluginStore } from './store/defWaterRingPluginStore'
import { initWaterRingPluginStore, resetWaterRingPluginStore } from './store/initWaterRingPluginStore'

export class WaterRingPlugin extends BaseAlchemyItemPlugin {
  private attackRendererFactory?: WaterRingAttackRendererFactory
  private waterRingPluginStore!: WaterRingPluginStore
  private isGameStarted = false
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItem = WATER_RING_ITEM

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
    this.attackRendererFactory = new WaterRingAttackRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    WaterRingAttackRenderer.loadAssets(ev.scene)
  }

  private init(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.subscribeEvent('playerWalk', this.onPlayerWalk)
    this.bus.subscribeEvent('playerDie', this.playerDie)
    this.bus.subscribeEvent('entitySpawn', this.spawnWaterRing)
    this.bus.subscribeEvent('entityDespawn', this.dieWaterRing)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.unsubscribeEvent('playerWalk', this.onPlayerWalk)
    this.bus.unsubscribeEvent('playerDie', this.playerDie)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnWaterRing)
    this.bus.unsubscribeEvent('entityDespawn', this.dieWaterRing)
  }

  protected handleGameStart(): void {
    this.isGameStarted = true
    initWaterRingPluginStore(this.store, this.attackRendererFactory)
    this.waterRingPluginStore = this.store.of('churarenWaterRingPlugin')
    this.socketController?.getStores()
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.isGameStarted = false
    this.socketController?.unregisterMessageListener()
    this.clearWaterRing()
    resetWaterRingPluginStore(this.store)
  }

  protected handleMidwayJoin(): void {
    this.unsubscribeGameEvent()
  }

  // 錬金アイテムを使用した時の処理
  public useAlchemyItem = (ev: UseAlchemyItemEvent): void => {
    if (ev.alchemyItem.kind !== 'waterRing') return

    const renderer = this.waterRingPluginStore.waterRingAttackRendererFactory.build()
    if (renderer === undefined) return

    const startPos = ev.ownPlayer.position.copy()
    const position = new Position(startPos.x, startPos.y)

    const waterRing = new WaterRing(uniqueId(), ev.ownPlayer.id, position, ev.ownPlayer.direction, Date.now())

    this.waterRingPluginStore.waterRings.set(waterRing.waterRingId, waterRing)
    this.waterRingPluginStore.waterRingAttackRenderers.set(waterRing.waterRingId, renderer)

    // 他のプレイヤーに攻撃の出現を送信する
    if (waterRing.churarenWeaponOwnerId === this.playerPluginStore.ownPlayerId) {
      this.networkStore.messageSender.send(
        new WaterRingSpawnMessage({
          waterRingId: waterRing.waterRingId,
          startPos: waterRing.position.toVector() as Vector & Sendable,
          direction: waterRing.direction,
          spawnTime: waterRing.spawnTime,
        })
      )
    }
    renderer.spawn(waterRing.position)

    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(ev.ownPlayer.id)
    this.bus.post(clearAlchemyItemBoxEvent)
  }

  private readonly onPlayerWalk = (ev: PlayerWalkEvent): void => {
    if (!this.isGameStarted) return
    const player = this.playerPluginStore.players.get(ev.id)
    if (player === undefined) return

    if (this.waterRingPluginStore.waterRings.size === 0) return
    // プレイヤーのidでWaterRingを検索
    const waterRing = this.waterRingPluginStore.waterRings.getByOwnerId(player.id)
    if (waterRing === undefined) return

    const renderer = this.waterRingPluginStore.waterRingAttackRenderers.get(waterRing.waterRingId)
    if (renderer === undefined) {
      return
    }

    const dest = player.position.copy()
    const gap = 40
    dest.x = player.position.x + player.direction.x * gap
    dest.y = player.position.y + player.direction.y * gap
    const speed = ev.speed ?? GRID_SIZE / GRID_WALK_DURATION_MS

    // 追従させる
    renderer?.chase(dest, speed, (pos: { x: number; y: number }) => {
      waterRing.position.x = pos.x
      waterRing.position.y = pos.y
    })
  }

  private readonly playerDie = (ev: PlayerDieEvent): void => {
    if (!this.isGameStarted) return
    const playerId = ev.id
    if (playerId === undefined) return

    const waterRing = this.waterRingPluginStore.waterRings.getByOwnerId(playerId)
    if (waterRing === undefined) return

    const waterRingAttackRenderer = this.waterRingPluginStore.waterRingAttackRenderers.get(waterRing.waterRingId)
    waterRing?.die()
    waterRingAttackRenderer?.dead()
    this.waterRingPluginStore.waterRings.delete(waterRing.waterRingId)
    this.waterRingPluginStore.waterRingAttackRenderers.delete(waterRing.waterRingId)
  }

  // 水の輪の出現を受信した時の処理
  private readonly spawnWaterRing = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof WaterRing)) return
    if (ev.entity.churarenWeaponOwnerId === this.playerPluginStore.ownPlayerId) return

    const waterRing = ev.entity
    const renderer = this.waterRingPluginStore.waterRingAttackRendererFactory.build()
    if (renderer === undefined) return

    this.waterRingPluginStore.waterRings.set(waterRing.waterRingId, waterRing)
    this.waterRingPluginStore.waterRingAttackRenderers.set(waterRing.waterRingId, renderer)

    renderer.spawn(waterRing.position)
  }

  private readonly dieWaterRing = (ev: EntityDespawnEvent): void => {
    if (!(ev.entity instanceof WaterRing)) return
    const waterRingId = ev.entity.waterRingId
    const waterRing = this.waterRingPluginStore.waterRings.get(waterRingId)
    const waterRingAttackRenderer = this.waterRingPluginStore.waterRingAttackRenderers.get(waterRingId)
    waterRing?.die()
    waterRingAttackRenderer?.dead()
    this.waterRingPluginStore.waterRings.delete(waterRingId)
    this.waterRingPluginStore.waterRingAttackRenderers.delete(waterRingId)
  }

  private clearWaterRing(): void {
    this.waterRingPluginStore.waterRings.clear()
    this.waterRingPluginStore.waterRingAttackRenderers.forEach((renderer) => {
      renderer.dead()
    })
    this.waterRingPluginStore.waterRingAttackRenderers.clear()
  }
}
