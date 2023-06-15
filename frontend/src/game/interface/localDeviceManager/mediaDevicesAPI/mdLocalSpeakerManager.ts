import { Speaker } from '../../../domain/model/localDevice/speaker'
import { ILocalSpeakerManager } from '../../../interactor/ILocalDeviceManager/ILocalSpeakerManager'

export class MdLocalSpeakerManager implements ILocalSpeakerManager {
  private _current: Speaker | null = null

  public static async build(activeDevice?: Speaker): Promise<MdLocalSpeakerManager> {
    const localSpeakerManager = new MdLocalSpeakerManager()
    // activeDeviceが省略されていない場合は_currentにactiveDeviceを設定
    if (activeDevice !== undefined) {
      localSpeakerManager._current = activeDevice
      return localSpeakerManager
    }

    // activeDeviceが省略されている場合はデフォルトの機器を_currentに設定
    const defaultDevice = await localSpeakerManager.getDevices()

    if (defaultDevice.length === 0) {
      // 接続機器がない場合は_currentはnull
      return localSpeakerManager
    } else {
      localSpeakerManager._current = defaultDevice[0]
      return localSpeakerManager
    }
  }

  private constructor() {}

  public async getDevices(): Promise<Speaker[]> {
    const defaultId = 'default'
    let devices = await navigator.mediaDevices.enumerateDevices()
    devices = devices.filter((info) => info.kind === 'audiooutput')

    // chromeが自動生成するdefaultデバイスはラベルが「既定 - デバイス名」になるのでdefaultデバイスを除外
    // defaultデバイスと同じidを持つMediaDeviceInfoをdevices[0]に設定
    if (devices.length > 1 && devices[0].deviceId === defaultId) {
      const defaultDevice = devices[0]
      for (let i = 1; i < devices.length; i += 1) {
        if (devices[i].groupId === defaultDevice.groupId) {
          const temp = devices[0]
          devices[0] = devices[i]
          devices[i] = temp
          break
        }
      }
      devices = devices.filter((device) => device !== defaultDevice)
    }

    return devices.map((device) => new Speaker(device.label, device.deviceId))
  }

  public switchDevice(target: Speaker): void {
    this._current = target
  }

  public get current(): Speaker | null {
    return this._current
  }
}
