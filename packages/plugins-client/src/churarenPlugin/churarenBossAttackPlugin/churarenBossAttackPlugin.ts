import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-client'
import type { DeathLog, PlayerPluginStore } from '@churaverse/player-plugin-client'
import {
  type EntityDespawnEvent,
  type EntitySpawnEvent,
  GRID_SIZE,
  type PhaserLoadAssets,
  type PhaserSceneInit,
  type StartEvent,
} from 'churaverse-engine-client'
import { SocketController } from './controller/socketController'
import { BossAttack, CHURAREN_BOSS_ATTACK_LIMIT_GRIDS } from './domain/bossAttack'
import type { IBossAttackRenderer } from './domain/IBossAttackRenderer'
import { BossAttackRenderer } from './renderer/bossAttackRenderer'
import { BossAttackRendererFactory } from './renderer/bossAttackRendererFactory'
import type { BossAttackPluginStore } from './store/defBossAttackPluginStore'
import { initBossAttackPluginStore, resetBossAttackPluginStore } from './store/initBossAttackPluginStore'
import '@churaverse/churaren-core-plugin-client'
import '@churaverse/core-ui-plugin-client'
import { BaseGamePlugin } from '@churaverse/game-plugin-client'

export class ChurarenBossAttackPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private rendererFactory?: BossAttackRendererFactory
  private bossAttackPluginStore!: BossAttackPluginStore
  private playerPluginStore!: PlayerPluginStore
  private socketController?: SocketController

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
  }

  public subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('entitySpawn', this.spawnBossAttack)
    this.bus.subscribeEvent('entityDespawn', this.dieBossAttack)
  }

  public unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('entitySpawn', this.spawnBossAttack)
    this.bus.unsubscribeEvent('entityDespawn', this.dieBossAttack)
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.rendererFactory = new BossAttackRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    BossAttackRenderer.loadAssets(ev.scene)
  }

  private init(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  public handleGameStart(): void {
    initBossAttackPluginStore(this.store, this.rendererFactory)
    this.bossAttackPluginStore = this.store.of('bossAttackPlugin')
    this.socketController?.registerMessageListener()
    this.socketController?.getStore()
  }

  public handleGameTermination(): void {
    resetBossAttackPluginStore(this.store)
    this.socketController?.unregisterMessageListener()
  }

  public handleMidwayJoin(): void {
    this.unsubscribeGameEvent()
  }

  private start(_ev: StartEvent): void {
    this.playerPluginStore.deathLogRenderer.addDeathLogMessageBuilder(
      'bossAttack',
      (deathLog: DeathLog) => `ボスの攻撃が ${deathLog.victim.name} に直撃！ ${deathLog.victim.name} は死んでしまった！`
    )
  }

  private readonly spawnBossAttack = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof BossAttack)) return
    const bossAttack = ev.entity
    this.bossAttackPluginStore.bossAttacks.set(bossAttack.bossAttackId, bossAttack)
    const renderer = this.bossAttackPluginStore.bossAttackRendererFactory.build()
    this.bossAttackPluginStore.bossAttackRenderers.set(bossAttack.bossAttackId, renderer)
    this.bossAttack(bossAttack, renderer)
  }

  private bossAttack(bossAttack: BossAttack, renderer: IBossAttackRenderer): void {
    const dest = bossAttack.position.copy()
    dest.x = bossAttack.direction.x * CHURAREN_BOSS_ATTACK_LIMIT_GRIDS * GRID_SIZE + bossAttack.position.x
    dest.y = bossAttack.direction.y * CHURAREN_BOSS_ATTACK_LIMIT_GRIDS * GRID_SIZE + bossAttack.position.y
    renderer.ignition(bossAttack.position, dest, bossAttack.direction, (pos) => {
      bossAttack.move(pos)
    })
  }

  private readonly dieBossAttack = (ev: EntityDespawnEvent): void => {
    if (!(ev.entity instanceof BossAttack)) return
    const bossAttackId = ev.entity.bossAttackId
    const bossAttack = this.bossAttackPluginStore.bossAttacks.get(bossAttackId)
    const bossAttackRenderer = this.bossAttackPluginStore.bossAttackRenderers.get(bossAttackId)
    bossAttack?.die()
    bossAttackRenderer?.dead()
    this.bossAttackPluginStore.bossAttacks.delete(bossAttackId)
    this.bossAttackPluginStore.bossAttackRenderers.delete(bossAttackId)
  }
}
