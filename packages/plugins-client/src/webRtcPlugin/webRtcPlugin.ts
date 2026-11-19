import { BasePlugin, type IMainScene } from 'churaverse-engine-client'
import { ChangeLocalDeviceEvent } from './event/changeLocalDeviceEvent'
import type { WebRtcPluginStore } from './store/defWebRtcPluginStore'
import { initWebRtcPluginStore } from './store/initWebRtcPluginStore'
import { WebRtcUi } from './ui/webRtcUi'
import '@churaverse/transition-plugin-client'

export class WebRtcPlugin extends BasePlugin<IMainScene> {
  private webRtcPluginStore!: WebRtcPluginStore
  private webRtcUi?: WebRtcUi

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
    this.bus.subscribeEvent('willSceneTransition', this.willSceneTransition.bind(this))
    this.bus.subscribeEvent('changeLocalDevice', this.onChangeLocalDevice.bind(this))
  }

  private init(): void {
    initWebRtcPluginStore(this.store)
    this.webRtcPluginStore = this.store.of('webRtcPlugin')
  }

  private start(): void {
    this.webRtcUi = new WebRtcUi(this.store, this.bus)

    navigator.mediaDevices.addEventListener('devicechange', () => {
      this.bus.post(new ChangeLocalDeviceEvent())
    })
  }

  private willSceneTransition(): void {
    void this.webRtcPluginStore.webRtc.disconnect()
  }

  private onChangeLocalDevice(): void {
    void this.updateSelectors()
  }

  // prettier-ignore
  private async updateSelectors(): Promise<void> {
    void this.webRtcUi?.cameraSelector.updateLocalDevices(await this.webRtcPluginStore.localCameraManager.getDevices())
    void this.webRtcUi?.micSelector.updateLocalDevices(await this.webRtcPluginStore.localMicrophoneManager.getDevices())
    void this.webRtcUi?.speakerSelector.updateLocalDevices(
      await this.webRtcPluginStore.localSpeakerManager.getDevices()
    )
  }
}
