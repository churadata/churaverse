import type { UseAlchemyItemEvent } from '@churaverse/churaren-alchemy-plugin-client'
import { BaseAlchemyItemPlugin, ClearAlchemyItemBoxEvent } from '@churaverse/churaren-alchemy-plugin-client'
import type { NetworkPluginStore, Sendable } from '@churaverse/network-plugin-client'
import type { PlayerPluginStore } from '@churaverse/player-plugin-client'
import {
  type EntityDespawnEvent,
  type EntitySpawnEvent,
  GRID_SIZE,
  type IMainScene,
  type PhaserLoadAssets,
  type PhaserSceneInit,
  Position,
  type Vector,
} from 'churaverse-engine-client'
import { SocketController } from './controller/socketController'
import { EXPLOSION_ITEM, EXPLOSION_WALK_LIMIT_GRIDS, Explosion } from './domain/explosion'
import type { IExplosionAttackRenderer } from './domain/IExplosionAttackRenderer'
import { ExplosionSpawnMessage } from './message/explosionSpawnMessage'
import { ExplosionAttackRenderer } from './renderer/explosionAttackRenderer'
import { ExplosionAttackRendererFactory } from './renderer/explosionAttackRendererFactory'
import type { ExplosionPluginStore } from './store/defExplosionPluginStore'
import { initExplosionPluginStore, resetExplosionPluginStore } from './store/initExplosionPluginStore'

export class ExplosionPlugin extends BaseAlchemyItemPlugin {
  private attackRendererFactory?: ExplosionAttackRendererFactory
  private explosionPluginStore!: ExplosionPluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItem = EXPLOSION_ITEM

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
    this.attackRendererFactory = new ExplosionAttackRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    ExplosionAttackRenderer.loadAssets(ev.scene)
  }

  private init(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.subscribeEvent('entitySpawn', this.spawnExplosion)
    this.bus.subscribeEvent('entityDespawn', this.dieExplosion)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnExplosion)
    this.bus.unsubscribeEvent('entityDespawn', this.dieExplosion)
  }

  protected handleGameStart(): void {
    initExplosionPluginStore(this.store, this.attackRendererFactory)
    this.explosionPluginStore = this.store.of('churarenExplosionPlugin')
    this.socketController?.getStores()
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    resetExplosionPluginStore(this.store)
    this.socketController?.unregisterMessageListener()
  }

  protected handleMidwayJoin(): void {
    this.unsubscribeGameEvent()
  }

  // 爆発アイテムを使った時の処理
  protected useAlchemyItem = (ev: UseAlchemyItemEvent): void => {
    if (ev.alchemyItem.kind !== 'explosion') return
    const renderer = this.explosionPluginStore.explosionAttackRendererFactory.build()
    const gap = 65
    const startPos = ev.ownPlayer.position.copy()
    const position = new Position(
      startPos.x + gap * ev.ownPlayer.direction.x,
      startPos.y + gap * ev.ownPlayer.direction.y
    )
    const explosion = new Explosion(
      ev.alchemyItem.itemId,
      ev.ownPlayer.id,
      position,
      ev.ownPlayer.direction,
      Date.now()
    )
    this.explosionPluginStore.explosions.set(explosion.explosionId, explosion)
    this.explosionPluginStore.explosionAttackRenderers.set(explosion.explosionId, renderer)
    // 他のプレイヤーに爆発の出現を送信する
    if (explosion.churarenWeaponOwnerId === this.playerPluginStore.ownPlayerId) {
      this.networkStore.messageSender.send(
        new ExplosionSpawnMessage({
          explosionId: explosion.explosionId,
          startPos: explosion.position.toVector() as Vector & Sendable,
          direction: explosion.direction,
          spawnTime: explosion.spawnTime,
        })
      )
    }

    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(ev.ownPlayer.id)
    this.bus.post(clearAlchemyItemBoxEvent)
    this.walkExplosion(explosion, renderer)
  }

  // 爆発の出現を受信した時の処理
  private readonly spawnExplosion = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof Explosion)) return
    if (ev.entity.churarenWeaponOwnerId === this.playerPluginStore.ownPlayerId) return
    const explosion = ev.entity
    const renderer = this.explosionPluginStore.explosionAttackRendererFactory.build()
    this.explosionPluginStore.explosions.set(explosion.explosionId, explosion)
    this.explosionPluginStore.explosionAttackRenderers.set(explosion.explosionId, renderer)
    this.walkExplosion(explosion, renderer)
  }

  private readonly dieExplosion = (ev: EntityDespawnEvent): void => {
    if (!(ev.entity instanceof Explosion)) return
    const explosionId = ev.entity.explosionId
    const explosion = this.explosionPluginStore.explosions.get(explosionId)
    const explosionAttackRenderer = this.explosionPluginStore.explosionAttackRenderers.get(explosionId)
    explosion?.die()
    explosionAttackRenderer?.dead()
    this.explosionPluginStore.explosions.delete(explosionId)
    this.explosionPluginStore.explosionAttackRenderers.delete(explosionId)
  }

  private walkExplosion(explosion: Explosion, render: IExplosionAttackRenderer): void {
    const dest = explosion.position.copy()
    dest.x = explosion.direction.x * EXPLOSION_WALK_LIMIT_GRIDS * GRID_SIZE + explosion.position.x
    dest.y = explosion.direction.y * EXPLOSION_WALK_LIMIT_GRIDS * GRID_SIZE + explosion.position.y
    render.walk(explosion.position, dest, (pos) => {
      explosion.walk(pos)
    })
  }
}
