import type http from 'node:http'
import { InitEvent } from '../../event/backendPhase/init'
import { StartEvent } from '../../event/backendPhase/start'
import { UpdateEvent } from '../../event/backendPhase/update'
import { EventBus } from '../../eventbus/eventBus'
import { PluginLoader } from '../../plugins/core/pluginLoader'
import { Store } from '../../store/store'
import type { SceneName, Scenes } from '../types'

export abstract class BaseScene {
  protected readonly store = new Store<Scenes>()
  protected readonly pluginLoader = new PluginLoader()
  protected readonly eventBus = new EventBus<Scenes>()
  private isFinishedInit: boolean = false

  public constructor(public readonly sceneName: SceneName) {}

  /**
   * プラグイン読み込み, initEventのpost, startEventのpostを行う
   */
  public async initialization(server: http.Server): Promise<void> {
    await this.pluginLoader.loadPlugins<Scenes>(this, this.eventBus, this.store)
    await this.eventBus.asyncPost(new InitEvent(server, this.sceneName))
    this.isFinishedInit = true
    this.eventBus.post(new StartEvent())
  }

  public update(time: number, delta: number): void {
    if (this.isFinishedInit) {
      this.eventBus.post(new UpdateEvent(time, delta))
    }
  }
}
