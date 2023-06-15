import { Microphone } from '../../../domain/model/localDevice/microphone'
import { ILocalMicrophoneManager } from '../../../interactor/ILocalDeviceManager/ILocalMicrophoneManager'

export class MdLocalMicrophoneManager implements ILocalMicrophoneManager {
  private _current: Microphone | null = null

  public static async build(activeDevice?: Microphone): Promise<MdLocalMicrophoneManager> {
    const localMicManager = new MdLocalMicrophoneManager()
    // activeDeviceが省略されていない場合は_currentにactiveDeviceを設定
    if (activeDevice !== undefined) {
      localMicManager._current = activeDevice
      return localMicManager
    }

    // activeDeviceが省略されている場合はデフォルトの機器を_currentに設定
    const defaultDevice = await localMicManager.getDevices()

    if (defaultDevice.length === 0) {
      // 接続機器がない場合は_currentはnull
      return localMicManager
    } else {
      localMicManager._current = defaultDevice[0]
      return localMicManager
    }
  }

  private constructor() {}

  public async getDevices(): Promise<Microphone[]> {
    const devices = (await navigator.mediaDevices.enumerateDevices()).filter((info) => info.kind === 'audioinput')
    return devices.map((device) => new Microphone(device.label, device.deviceId))
  }

  public switchDevice(target: Microphone): void {
    this._current = target
  }

  public get current(): Microphone | null {
    return this._current
  }
}
