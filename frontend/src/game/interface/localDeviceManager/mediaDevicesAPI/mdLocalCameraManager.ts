import { Camera } from '../../../domain/model/localDevice/camera'
import { ILocalCameraManager } from '../../../interactor/ILocalDeviceManager/ILocalCameraManager'

export class MdLocalCameraManager implements ILocalCameraManager {
  private _current: Camera | null = null

  public static async build(activeDevice?: Camera): Promise<MdLocalCameraManager> {
    const localCameraManager = new MdLocalCameraManager()
    // activeDeviceが省略されていない場合は_currentにactiveDeviceを設定
    if (activeDevice !== undefined) {
      localCameraManager._current = activeDevice
      return localCameraManager
    }

    // activeDeviceが省略されている場合はデフォルトの機器を_currentに設定
    const defaultDevice = await localCameraManager.getDevices()
    if (defaultDevice.length === 0) {
      // 接続機器がない場合は_currentはnull
      return localCameraManager
    } else {
      localCameraManager._current = defaultDevice[0]
      return localCameraManager
    }
  }

  private constructor() {}

  public async getDevices(): Promise<Camera[]> {
    const devices = (await navigator.mediaDevices.enumerateDevices()).filter((info) => info.kind === 'videoinput')
    return devices.map((device) => new Camera(device.label, device.deviceId))
  }

  public switchDevice(target: Camera): void {
    this._current = target
  }

  public get current(): Camera | null {
    return this._current
  }
}
