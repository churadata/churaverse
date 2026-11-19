import type { UseAlchemyItemEvent } from '@churaverse/churaren-alchemy-plugin-client'
import { BaseAlchemyItemPlugin, ClearAlchemyItemBoxEvent } from '@churaverse/churaren-alchemy-plugin-client'
import type { NetworkPluginStore, Sendable } from '@churaverse/network-plugin-client'
import type { PlayerPluginStore } from '@churaverse/player-plugin-client'
import {
  type EntityDespawnEvent,
  type EntitySpawnEvent,
  GRID_SIZE,
  type IMainScene,
  type InitEvent,
  type PhaserLoadAssets,
  type PhaserSceneInit,
  Position,
  uniqueId,
  type Vector,
} from 'churaverse-engine-client'
import { SocketController } from './controller/socketController'
import type { IIceArrowAttackRenderer } from './domain/IIceArrowAttackRenderer'
import { ICE_ARROW_ITEM, ICE_ARROW_WALK_LIMIT_GRIDS, IceArrow } from './domain/iceArrow'
import { IceArrowSpawnMessage } from './message/iceArrowSpawnMessage'
import { IceArrowAttackRenderer } from './renderer/iceArrowAttackRenderer'
import { IceArrowAttackRendererFactory } from './renderer/iceArrowAttackRendererFactory'
import type { IceArrowPluginStore } from './store/defIceArrowPluginStore'
import { initIceArrowPluginStore, resetIceArrowPluginStore } from './store/initIceArrowPluginStore'

export class IceArrowPlugin extends BaseAlchemyItemPlugin {
  private attackRendererFactory?: IceArrowAttackRendererFactory
  private iceArrowPluginStore!: IceArrowPluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItem = ICE_ARROW_ITEM

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
    this.attackRendererFactory = new IceArrowAttackRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    IceArrowAttackRenderer.loadAssets(ev.scene)
  }

  private init(_ev: InitEvent): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.subscribeEvent('entitySpawn', this.spawnIceArrow)
    this.bus.subscribeEvent('entityDespawn', this.dieIceArrow)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnIceArrow)
    this.bus.unsubscribeEvent('entityDespawn', this.dieIceArrow)
  }

  protected handleGameStart(): void {
    initIceArrowPluginStore(this.store, this.attackRendererFactory)
    this.iceArrowPluginStore = this.store.of('churarenIceArrowPlugin')
    this.socketController?.getStores()
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    resetIceArrowPluginStore(this.store)
    this.socketController?.unregisterMessageListener()
  }

  protected handleMidwayJoin(): void {
    this.unsubscribeGameEvent()
  }

  protected useAlchemyItem = (ev: UseAlchemyItemEvent): void => {
    if (ev.alchemyItem.kind !== 'iceArrow') return

    const gap = 65

    for (let i = 0; i < 8; i++) {
      const renderer = this.iceArrowPluginStore.iceArrowAttackRendererFactory.build()
      if (renderer === undefined) return

      const startPos = ev.ownPlayer.position.copy()

      // 8方向に分散するための角度を計算 (ラジアン)
      const angle = -i * (Math.PI / 4) // 45度 (π/4) ごとに回転

      // x, y成分で方向ベクトルを計算
      const attackVector = {
        x: parseFloat(Math.cos(angle).toFixed(2)),
        y: parseFloat(Math.sin(angle).toFixed(2)),
      }

      const position = new Position(startPos.x + gap * attackVector.x, startPos.y + gap * attackVector.y)
      const iceArrow = new IceArrow(
        uniqueId(),
        ev.ownPlayer.id,
        position,
        ev.ownPlayer.direction,
        Date.now(),
        attackVector
      )

      this.iceArrowPluginStore.iceArrows.set(iceArrow.iceArrowId, iceArrow)
      this.iceArrowPluginStore.iceArrowAttackRenderers.set(iceArrow.iceArrowId, renderer)

      if (iceArrow.churarenWeaponOwnerId === this.playerPluginStore.ownPlayerId) {
        const iceArrowSpawnMessage = new IceArrowSpawnMessage({
          iceArrowId: iceArrow.iceArrowId,
          startPos: iceArrow.position.toVector() as Vector & Sendable,
          direction: iceArrow.direction,
          spawnTime: iceArrow.spawnTime,
          attackVector: iceArrow.attackVector as Vector & Sendable,
        })
        this.networkStore.messageSender.send(iceArrowSpawnMessage)
      }

      this.walkIceArrow(iceArrow, renderer)
    }

    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(ev.ownPlayer.id)
    this.bus.post(clearAlchemyItemBoxEvent)
  }

  private readonly spawnIceArrow = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof IceArrow)) return

    const renderer = this.iceArrowPluginStore.iceArrowAttackRendererFactory.build()
    if (renderer === undefined) return

    const iceArrow = ev.entity
    this.iceArrowPluginStore.iceArrows.set(iceArrow.iceArrowId, iceArrow)
    this.iceArrowPluginStore.iceArrowAttackRenderers.set(iceArrow.iceArrowId, renderer)

    this.walkIceArrow(iceArrow, renderer)
  }

  private readonly dieIceArrow = (ev: EntityDespawnEvent): void => {
    if (!(ev.entity instanceof IceArrow)) return

    const iceArrowId = ev.entity.iceArrowId
    const iceArrow = this.iceArrowPluginStore.iceArrows.get(iceArrowId)
    const iceArrowRenderer = this.iceArrowPluginStore.iceArrowAttackRenderers.get(iceArrowId)

    iceArrow?.die()
    iceArrowRenderer?.dead()

    this.iceArrowPluginStore.iceArrows.delete(iceArrowId)
    this.iceArrowPluginStore.iceArrowAttackRenderers.delete(iceArrowId)
  }

  private walkIceArrow(iceArrow: IceArrow, renderer: IIceArrowAttackRenderer): void {
    // 斜め方向も水平・垂直方向も全て同じ移動距離にする
    const distance = ICE_ARROW_WALK_LIMIT_GRIDS * GRID_SIZE
    const dest = iceArrow.position.copy()
    const moveX = iceArrow.attackVector.x * distance
    const moveY = iceArrow.attackVector.y * distance
    dest.x += moveX
    dest.y += moveY

    // アニメーションの再生
    renderer.walk(iceArrow.position, dest, iceArrow.direction, iceArrow.attackVector, (pos) => {
      iceArrow.walk(pos)
    })
  }
}
