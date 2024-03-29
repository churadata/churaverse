import { ILocalCameraManager } from '../../interactor/ILocalDeviceManager/ILocalCameraManager'
import { ILocalDevice } from '../../interactor/ILocalDeviceManager/ILocalDevice'
import { ILocalMicrophoneManager } from '../../interactor/ILocalDeviceManager/ILocalMicrophoneManager'
import { ILocalSpeakerManager } from '../../interactor/ILocalDeviceManager/ILocalSpeakerManager'
import { Interactor } from '../../interactor/Interactor'

export class LocalDevice implements ILocalDevice {
  private interactor?: Interactor

  public constructor(
    public readonly microphoneManager: ILocalMicrophoneManager,
    public readonly speakerManager: ILocalSpeakerManager,
    public readonly cameraManager: ILocalCameraManager
  ) {
    this.listenDeviceChange(() => {
      void this.interactor?.deviceChange()
    })

    /**
     * マイク・カメラの権限の変更を受け取り、デバイスの選択ができるように権限の状態を反映する。
     */
    this.listenDevicePermissionChange(() => {
      void this.interactor?.deviceChange()
    }, 'microphone')

    this.listenDevicePermissionChange(() => {
      void this.interactor?.deviceChange()
    }, 'camera')
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  public listenDeviceChange(onChange: () => void): void {
    navigator.mediaDevices.addEventListener('devicechange', () => {
      onChange()
    })
  }

  public listenDevicePermissionChange(onChange: () => void, targetName: 'camera' | 'microphone'): void {
    void navigator.permissions.query({ name: targetName as PermissionName }).then((deviceStatus) => {
      deviceStatus.onchange = () => {
        onChange()
      }
    })
  }
}
