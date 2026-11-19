import type { DebugScreenPluginStore, DumpDebugDataEvent } from '@churaverse/debug-screen-plugin-client'
import { DebugDetailScreenSection } from '@churaverse/debug-screen-plugin-client'
import type { KeyboardPluginStore } from '@churaverse/keyboard-plugin-client'
import type { NetworkPluginStore, SendableObject } from '@churaverse/network-plugin-client'
import type { DeathLog, Player, PlayerPluginStore } from '@churaverse/player-plugin-client'
import {
  BasePlugin,
  type EntityDespawnEvent,
  type EntitySpawnEvent,
  type IMainScene,
  type InitEvent,
  type PhaserLoadAssets,
  type PhaserSceneInit,
  type StartEvent,
  type Vector,
} from 'churaverse-engine-client'
import { KeyboardController } from './controller/keyboardController'
import { SocketController } from './controller/socketController'
import { BombCountDebugDetailScreen } from './debugScreen/bombCountDebugDetailScreen'
import type { IBombCountDebugDetailScreen } from './debugScreen/IDebugScreen/IBombCountDebugDetailScreen'
import { Bomb } from './domain/bomb'
import type { IBombRenderer } from './domain/IBombRenderer'
import { BombSpawnMessage } from './message/bombSpawnMessage'
import { BombRenderer } from './renderer/bombRenderer'
import { BombRendererFactory } from './renderer/bombRendererFactory'
import type { BombPluginStore } from './store/defBombPluginStore'
import { initBombPluginStore } from './store/initBombPluginStore'

export class BombPlugin extends BasePlugin<IMainScene> {
  private rendererFactory?: BombRendererFactory
  // Store系のプロパティは、コンストラクタではなくinitイベントで初期化されます。
  private bombPluginStore!: BombPluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private keyboardStore!: KeyboardPluginStore<IMainScene>
  private debugScreenStore!: DebugScreenPluginStore
  private bombCountDebugDetailScreen!: IBombCountDebugDetailScreen

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))

    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    const keyboardController = new KeyboardController(this.bus, this.store)
    this.bus.subscribeEvent('registerKayAction', keyboardController.registerKeyAction.bind(keyboardController))
    this.bus.subscribeEvent(
      'registerKeyActionListener',
      keyboardController.registerKeyActionListener.bind(keyboardController)
    )

    this.bus.subscribeEvent('entitySpawn', this.spawnBomb.bind(this))
    this.bus.subscribeEvent('entityDespawn', this.removeBomb.bind(this))
    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.rendererFactory = new BombRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    BombRenderer.loadAssets(ev.scene)
  }

  private init(_ev: InitEvent): void {
    initBombPluginStore(this.store, this.rendererFactory)
    this.bombPluginStore = this.store.of('bombPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
    this.keyboardStore = this.store.of('keyboardPlugin')
    this.debugScreenStore = this.store.of('debugScreenPlugin')
  }

  private start(_ev: StartEvent): void {
    this.keyboardStore.keySettingWindow.addKeyAction('DropBomb', '爆弾を投下')
    this.playerPluginStore.deathLogRenderer.addDeathLogMessageBuilder(
      'bomb',
      (deathLog: DeathLog) =>
        `${deathLog.victim.name} が死亡！ ${(deathLog.killer as Player).name} の爆弾の威力半端ねえぜ！`
    )
    this.setupDebugScreen()
  }

  private setupDebugScreen(): void {
    const debugDetailScreenContainer = this.debugScreenStore.debugDetailScreenContainer
    debugDetailScreenContainer.addSection(new DebugDetailScreenSection('bombInfo', 'Bomb'))
    this.bombCountDebugDetailScreen = new BombCountDebugDetailScreen(debugDetailScreenContainer)
    this.updateDebugScreenBombCount()
  }

  public spawnBomb(ev: EntitySpawnEvent): void {
    if (!(ev.entity instanceof Bomb)) return
    const bomb = ev.entity as Bomb
    const renderer = this.bombPluginStore.bombRendererFactory.build()
    this.bombPluginStore.bombs.set(bomb.bombId, bomb)
    this.bombPluginStore.bombRenderers.set(bomb.bombId, renderer)
    this.updateDebugScreenBombCount()

    // 他のプレイヤーに爆弾の出現を送信する
    if (bomb.ownerId === this.playerPluginStore.ownPlayerId) {
      this.networkStore.messageSender.send(
        new BombSpawnMessage({
          bombId: bomb.bombId,
          startPos: bomb.position.toVector() as Vector & SendableObject,
          direction: bomb.direction,
          spawnTime: bomb.spawnTime,
        })
      )
    }

    this.dropBomb(bomb, renderer)
  }

  public dropBomb(bomb: Bomb, renderer: IBombRenderer): void {
    const source = bomb.ownerId
    if (source === undefined) {
      renderer.destroy()
      return
    }

    renderer.drop(bomb.position)
  }

  public removeBomb(ev: EntityDespawnEvent): void {
    if (!(ev.entity instanceof Bomb)) return
    const bombId = ev.entity.bombId
    const bombRenderer = this.bombPluginStore.bombRenderers.get(bombId)
    if (bombRenderer === undefined) return
    bombRenderer.explode()

    this.bombPluginStore.bombs.delete(bombId)
    this.bombPluginStore.bombRenderers.delete(bombId)
    this.updateDebugScreenBombCount()
  }

  private updateDebugScreenBombCount(): void {
    const bombCount = this.bombPluginStore.bombs.size
    this.bombCountDebugDetailScreen.update(bombCount)
  }

  private dumpDebugData(ev: DumpDebugDataEvent): void {
    const bombCount = this.bombPluginStore.bombs.size
    ev.dataDumper.dump('bombCount', bombCount.toString())
  }
}
