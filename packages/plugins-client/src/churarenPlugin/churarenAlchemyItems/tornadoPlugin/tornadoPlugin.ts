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
import '@churaverse/churaren-core-plugin-client'
import type { ITornadoAttackRenderer } from './domain/ITornadoAttackRenderer'
import { TORNADO_ITEM, TORNADO_WALK_LIMIT_GRIDS, Tornado } from './domain/tornado'
import { TornadoSpawnMessage } from './message/tornadoSpawnMessage'
import { TornadoAttackRenderer } from './renderer/tornadoAttackRenderer'
import { TornadoAttackRendererFactory } from './renderer/tornadoAttackRendererFactory'
import type { TornadoPluginStore } from './store/defTornadoPluginStore'
import { initTornadoPluginStore, resetTornadoPluginStore } from './store/initTornadoPluginStore'

export class TornadoPlugin extends BaseAlchemyItemPlugin {
  private attackRendererFactory?: TornadoAttackRendererFactory
  private tornadoPluginStore!: TornadoPluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItem = TORNADO_ITEM

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
    this.attackRendererFactory = new TornadoAttackRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    TornadoAttackRenderer.loadAssets(ev.scene)
  }

  private init(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.subscribeEvent('entitySpawn', this.spawnTornado)
    this.bus.subscribeEvent('entityDespawn', this.dieTornado)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnTornado)
    this.bus.unsubscribeEvent('entityDespawn', this.dieTornado)
  }

  protected handleGameStart(): void {
    initTornadoPluginStore(this.store, this.attackRendererFactory)
    this.tornadoPluginStore = this.store.of('churarenTornadoPlugin')
    this.socketController?.getStores()
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    resetTornadoPluginStore(this.store)
    this.socketController?.unregisterMessageListener()
  }

  protected handleMidwayJoin(): void {
    this.unsubscribeGameEvent()
  }

  // 竜巻アイテムを使った時の処理
  protected useAlchemyItem = (ev: UseAlchemyItemEvent): void => {
    if (ev.alchemyItem.kind !== 'tornado') return
    const renderer = this.tornadoPluginStore.tornadoAttackRendererFactory.build()
    const gap = 65
    const startPos = ev.ownPlayer.position.copy()
    const position = new Position(
      startPos.x + gap * ev.ownPlayer.direction.x,
      startPos.y + gap * ev.ownPlayer.direction.y
    )
    const tornado = new Tornado(ev.alchemyItem.itemId, ev.ownPlayer.id, position, ev.ownPlayer.direction, Date.now())
    if (renderer == null) return
    this.tornadoPluginStore.tornados.set(tornado.tornadoId, tornado)
    this.tornadoPluginStore.tornadoAttackRenderers.set(tornado.tornadoId, renderer)
    // 他のプレイヤーに竜巻の出現を送信する
    if (tornado.churarenWeaponOwnerId === this.playerPluginStore.ownPlayerId) {
      this.networkStore.messageSender.send(
        new TornadoSpawnMessage({
          tornadoId: tornado.tornadoId,
          startPos: tornado.position.toVector() as Vector & Sendable,
          direction: tornado.direction,
          spawnTime: tornado.spawnTime,
        })
      )
    }

    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(ev.ownPlayer.id)
    this.bus.post(clearAlchemyItemBoxEvent)

    this.walkTornado(tornado, renderer)
  }

  // 竜巻の出現を受信した時の処理
  private readonly spawnTornado = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof Tornado)) return
    if (ev.entity.churarenWeaponOwnerId === this.playerPluginStore.ownPlayerId) return
    const tornado = ev.entity
    const renderer = this.tornadoPluginStore.tornadoAttackRendererFactory.build()
    this.tornadoPluginStore.tornados.set(tornado.tornadoId, tornado)
    this.tornadoPluginStore.tornadoAttackRenderers.set(tornado.tornadoId, renderer)
    this.walkTornado(tornado, renderer)
  }

  private readonly dieTornado = (ev: EntityDespawnEvent): void => {
    if (!(ev.entity instanceof Tornado)) return
    const tornadoId = ev.entity.tornadoId
    const tornado = this.tornadoPluginStore.tornados.get(tornadoId)
    const tornadoAttackRenderer = this.tornadoPluginStore.tornadoAttackRenderers.get(tornadoId)
    tornado?.die()
    tornadoAttackRenderer?.dead()
    this.tornadoPluginStore.tornados.delete(tornadoId)
    this.tornadoPluginStore.tornadoAttackRenderers.delete(tornadoId)
  }

  private walkTornado(tornado: Tornado, render: ITornadoAttackRenderer): void {
    const totalSteps = 10 // アニメーションの総ステップ数
    const unitStepDistance = TORNADO_WALK_LIMIT_GRIDS * GRID_SIZE // 1ステップあたりの移動距離

    let stepIndex = 0 // 現在のステップ数

    const animateStep = (): void => {
      if (stepIndex > totalSteps) {
        render.dead()
        return
      }

      // nステップ目の竜巻の移動方向(stepIndexが偶数の時と奇数の時で切り替え)
      const attackDirection = stepIndex % 2 === 0 ? 1 : -1
      const dir = tornado.direction
      const perp = { x: -dir.y, y: dir.x } // 直交ベクトル

      // 1ステップ目は移動距離が半分(ジグザグの真ん中から開始するため)
      const moveDistance = stepIndex === 0 ? unitStepDistance / 2 : unitStepDistance
      const dest = new Position(
        tornado.position.x + dir.x * moveDistance + perp.x * attackDirection * moveDistance,
        tornado.position.y + dir.y * moveDistance + perp.y * attackDirection * moveDistance
      )

      render.walk(
        tornado.position,
        dest,
        (pos) => {
          tornado.walk(pos)
        },
        () => {
          stepIndex++
          animateStep() // 次のステップを呼び出す
        }
      )
    }

    // アニメーションを開始
    animateStep()
  }
}
