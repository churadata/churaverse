import { Camera } from '../../domain/localDevice/camera'
import type { ILocalCameraManager } from '../../interface/ILocalDeviceManager/ILocalCameraManager'

export class MdLocalCameraManager implements ILocalCameraManager {
  public async getCurrent(): Promise<Camera | null> {
    const devices = await this.getDevices()
    if (devices.length === 0) {
      return null
    }

    return devices[0]
  }

  public async getDevices(): Promise<Camera[]> {
    const defaultId = 'default'
    let devices = await navigator.mediaDevices.enumerateDevices()
    devices = devices.filter((info) => info.kind === 'videoinput')

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

    return devices.map((device) => new Camera(device.label, device.deviceId))
  }

  public switchDevice(_target: Camera): void {
    throw Error('switch Deviceは未実装')
  }
}
