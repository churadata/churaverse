import { Speaker } from '../../domain/localDevice/speaker'
import type { ILocalSpeakerManager } from '../../interface/ILocalDeviceManager/ILocalSpeakerManager'

export class MdLocalSpeakerManager implements ILocalSpeakerManager {
  public async getCurrent(): Promise<Speaker | null> {
    const devices = await this.getDevices()
    if (devices.length === 0) {
      return null
    }

    return devices[0]
  }

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

  public switchDevice(_target: Speaker): void {
    throw Error('switch Deviceは未実装')
  }
}
