import { ILocalCameraManager } from './ILocalCameraManager'
import { ILocalMicrophoneManager } from './ILocalMicrophoneManager'
import { ILocalSpeakerManager } from './ILocalSpeakerManager'

/**
 * 接続機器を管理する
 */
export interface ILocalDevice {
  microphoneManager: ILocalMicrophoneManager
  speakerManager: ILocalSpeakerManager
  cameraManager: ILocalCameraManager

  /**
   * 接続機器が変更した際に実行するcallbackを設定する
   */
  listenDeviceChange: (onChange: () => void) => void
}
