import { Scene as PhaserScene } from 'phaser'
import { InitEvent } from '../../event/gamePhase/init'
import { OnGameShutdownEvent } from '../../event/gamePhase/onGameShutdown'
import { PhaserLoadAssets } from '../../event/gamePhase/phaser/phaserLoadAssets'
import { PhaserSceneCreate } from '../../event/gamePhase/phaser/phaserSceneCreate'
import { PhaserSceneInit } from '../../event/gamePhase/phaser/phaserSceneInit'
import { PhaserScenePreload } from '../../event/gamePhase/phaser/phaserScenePreload'
import { StartEvent } from '../../event/gamePhase/start'
import { UpdateEvent } from '../../event/gamePhase/update'
import { EventBus } from '../../eventbus/eventBus'
import { PluginLoader } from '../../plugins/core/pluginLoader'
import { Store } from '../../store/store'
import type { SceneName, Scenes } from '../types'

export abstract class BaseScene extends PhaserScene {
  protected readonly store = new Store<Scenes>()
  protected readonly pluginLoader = new PluginLoader()
  protected readonly eventBus = new EventBus<Scenes>()
  private isFinishedInit: boolean = false

  public constructor(
    public readonly sceneName: SceneName,
    config: string | Phaser.Types.Scenes.SettingsConfig
  ) {
    super(config)
  }

  public preInit(): void {
    this.store.deleteStore()
    this.eventBus.deleteAllListeners()
  }

  public init(): void {
    this.pluginLoader.loadPlugins(this, this.eventBus, this.store)
    this.eventBus.post(new PhaserSceneInit(this))
  }

  public preload(): void {
    this.eventBus.post(new PhaserScenePreload(this))
    this.eventBus.post(new PhaserLoadAssets(this))
  }

  public async create(): Promise<void> {
    this.eventBus.post(new PhaserSceneCreate(this))
    await this.eventBus.asyncPost(new InitEvent())
    this.isFinishedInit = true
    this.eventBus.post(new StartEvent())

    window.addEventListener('beforeunload', () => {
      this.eventBus.post(new OnGameShutdownEvent())
    })
  }

  public update(time: number, delta: number): void {
    if (this.isFinishedInit) this.eventBus.post(new UpdateEvent(time, delta))
  }
}
