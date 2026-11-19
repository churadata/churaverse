import { WillSceneTransitionEvent } from '@churaverse/transition-plugin-client'
import {
  BasePlugin,
  EVENT_PRIORITY,
  type InitEvent,
  type OnGameShutdownEvent,
  type Scenes,
} from 'churaverse-engine-client'
import { DataPersistence } from './dataPersistence'
import { initDataPersistencePluginStore } from './store/initDataPersistencePluginStore'

export class DataPersistencePlugin extends BasePlugin<Scenes> {
  private dataPersistence!: DataPersistence

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this), EVENT_PRIORITY.HIGHEST)
    this.bus.subscribeEvent('willSceneTransition', this.saveData.bind(this), EVENT_PRIORITY.LOW)
    this.bus.subscribeEvent('onGameShutdown', this.saveData.bind(this))
  }

  private async init(_ev: InitEvent): Promise<void> {
    this.dataPersistence = new DataPersistence()
    await this.dataPersistence.load()
    initDataPersistencePluginStore(this.store, this.dataPersistence)
  }

  private async saveData(ev: OnGameShutdownEvent | WillSceneTransitionEvent<Scenes, Scenes>): Promise<void> {
    // 退出ボタンを押した場合のWillSceneTransitionEventのみ
    if (ev instanceof WillSceneTransitionEvent) {
      if (ev.from !== 'MainScene' && ev.to !== 'TitleScene') return
    }
    await this.dataPersistence.save()
  }
}
