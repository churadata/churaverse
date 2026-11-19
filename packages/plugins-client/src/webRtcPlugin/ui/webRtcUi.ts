import { SettingSection } from '@churaverse/core-ui-plugin-client'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import type { WebRtcPluginStore } from '../store/defWebRtcPluginStore'
import { CameraSelector } from './deviceSelector/cameraSelector'
import { MicSelector } from './deviceSelector/micSelector'
import { SpeakerSelector } from './deviceSelector/speakerSelector'

export class WebRtcUi {
  public readonly cameraSelector: CameraSelector
  public readonly micSelector: MicSelector
  public readonly speakerSelector: SpeakerSelector

  public constructor(store: Store<IMainScene>, eventBus: IEventBus<IMainScene>) {
    const uiStore = store.of('coreUiPlugin')
    const webRtcPluginStore = store.of('webRtcPlugin')
    const dataPersistence = store.of('dataPersistencePlugin').dataPersistence

    const settingDialog = uiStore.settingDialog
    settingDialog.addSection(new SettingSection('peripheralSetting', '接続機器設定'))

    this.cameraSelector = new CameraSelector(
      eventBus,
      webRtcPluginStore.localCameraManager,
      dataPersistence,
      settingDialog,
      []
    )
    this.micSelector = new MicSelector(
      eventBus,
      webRtcPluginStore.localMicrophoneManager,
      dataPersistence,
      settingDialog,
      []
    )
    this.speakerSelector = new SpeakerSelector(
      eventBus,
      webRtcPluginStore.localSpeakerManager,
      dataPersistence,
      settingDialog,
      []
    )

    this.initSelectors(webRtcPluginStore)
  }

  private initSelectors(webRtcPluginStore: WebRtcPluginStore): void {
    webRtcPluginStore.localCameraManager
      .getDevices()
      .then((devices) => {
        this.cameraSelector.updateLocalDevices(devices)
      })
      .catch((err) => {
        throw err
      })

    webRtcPluginStore.localMicrophoneManager
      .getDevices()
      .then((devices) => {
        this.micSelector.updateLocalDevices(devices)
      })
      .catch((err) => {
        throw err
      })

    webRtcPluginStore.localSpeakerManager
      .getDevices()
      .then((devices) => {
        this.speakerSelector.updateLocalDevices(devices)
      })
      .catch((err) => {
        throw err
      })
  }
}
