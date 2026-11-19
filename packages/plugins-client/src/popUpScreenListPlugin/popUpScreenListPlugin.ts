import type { WebRtcPluginStore } from '@churaverse/web-rtc-plugin-client'
import { BasePlugin, type IMainScene, type PhaserSceneInit } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import { initVideoStore } from './store/initVideoStore'
import type { PopUpScreenList } from './ui/popUpScreenList'

export class PopUpScreenListPlugin extends BasePlugin<IMainScene> {
  private scene?: Scene
  private webRtcPluginStore!: WebRtcPluginStore
  private popUpScreenList!: PopUpScreenList

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private init(): void {
    this.webRtcPluginStore = this.store.of('webRtcPlugin')
    initVideoStore(this.store)
    this.popUpScreenList = this.store.of('popUpScreenList') as PopUpScreenList
  }
}
