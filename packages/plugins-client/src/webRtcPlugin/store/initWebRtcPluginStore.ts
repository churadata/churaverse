import type { IMainScene, Store } from 'churaverse-engine-client'
import { LkLocalCameraManager } from '../localDeviceManager/livekitApi/lkLocalCameraManager'
import { LkLocalMicrophoneManager } from '../localDeviceManager/livekitApi/lkLocalMicrophoneManager'
import { LkLocalSpeakerManager } from '../localDeviceManager/livekitApi/lkLocalSpeakerManager'
import { WebRtc } from '../webRtc'
import type { WebRtcPluginStore } from './defWebRtcPluginStore'
import '@churaverse/player-plugin-client'

export function initWebRtcPluginStore(store: Store<IMainScene>): void {
  const ownPlayerId = store.of('playerPlugin').ownPlayerId

  const webRtc = new WebRtc(ownPlayerId)

  const webRtcPluginStore: WebRtcPluginStore = {
    webRtc,
    localCameraManager: new LkLocalCameraManager(webRtc.room),
    localMicrophoneManager: new LkLocalMicrophoneManager(webRtc.room),
    localSpeakerManager: new LkLocalSpeakerManager(webRtc.room),
  }

  store.setInit('webRtcPlugin', webRtcPluginStore)
}
