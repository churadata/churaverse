import { Room } from 'livekit-client'
import { Microphone } from '../../domain/localDevice/microphone'
import type { ILocalMicrophoneManager } from '../../interface/ILocalDeviceManager/ILocalMicrophoneManager'
import { peripheralPermissionCheck } from '../../peripheralPermissionCheck'

/**
 * 接続されているマイクを操作する
 * LiveKitのAPIを使って実装
 */
export class LkLocalMicrophoneManager implements ILocalMicrophoneManager {
  public constructor(private readonly room: Room) {}

  public async getCurrent(): Promise<Microphone | null> {
    const devices = await this.getDevices()
    if (devices.length === 0) {
      return null
    }

    return devices[0]
  }

  public async getDevices(): Promise<Microphone[]> {
    // Room.getLocalDevicesはMediaDevices.enumerateDevices()と同じ要素を返すので、
    // 最初の要素がデフォルトのキャプチャ機器
    // https://docs.livekit.io/client-sdk-js/index.html#device-management-apis
    // https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/enumerateDevices#%E8%BF%94%E5%80%A4

    const microphoneStatus: boolean = await peripheralPermissionCheck('microphone')
    const devices = await Room.getLocalDevices('audioinput', microphoneStatus)
    return devices.map((device) => new Microphone(device.label, device.deviceId))
  }

  public switchDevice(mic: Microphone): void {
    void this.room.switchActiveDevice('audioinput', mic.id)
  }
}
