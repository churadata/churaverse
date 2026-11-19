import type { ILocalCameraManager } from '../interface/ILocalDeviceManager/ILocalCameraManager'
import type { ILocalMicrophoneManager } from '../interface/ILocalDeviceManager/ILocalMicrophoneManager'
import type { ILocalSpeakerManager } from '../interface/ILocalDeviceManager/ILocalSpeakerManager'
import type { WebRtc } from '../webRtc'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    webRtcPlugin: WebRtcPluginStore
  }
}

export interface WebRtcPluginStore {
  readonly webRtc: WebRtc
  readonly localCameraManager: ILocalCameraManager
  readonly localMicrophoneManager: ILocalMicrophoneManager
  readonly localSpeakerManager: ILocalSpeakerManager
}
