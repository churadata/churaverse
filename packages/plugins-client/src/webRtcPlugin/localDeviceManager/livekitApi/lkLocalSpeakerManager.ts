import { Room } from 'livekit-client'
import { Speaker } from '../../domain/localDevice/speaker'
import type { ILocalSpeakerManager } from '../../interface/ILocalDeviceManager/ILocalSpeakerManager'
import { peripheralPermissionCheck } from '../../peripheralPermissionCheck'

/**
 * 接続されているスピーカを操作する
 * LiveKitのAPIを使って実装
 */
export class LkLocalSpeakerManager implements ILocalSpeakerManager {
  public constructor(private readonly room: Room) {}

  public async getCurrent(): Promise<Speaker | null> {
    const devices = await this.getDevices()
    if (devices.length === 0) {
      return null
    }

    return devices[0]
  }

  public async getDevices(): Promise<Speaker[]> {
    // Room.getLocalDevicesはMediaDevices.enumerateDevices()と同じ要素を返すので、
    // 最初の要素がデフォルトのキャプチャ機器
    // https://docs.livekit.io/client-sdk-js/index.html#device-management-apis
    // https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/enumerateDevices#%E8%BF%94%E5%80%A4

    // スピーカーを利用する分には権限は不要ですが、webページがデバイスを確認する際には権限が必要になります
    // 権限の取得について、スピーカーのみの権限の取得は存在せず、マイクの権限を必要とするためmicrophoneStatusという内容を利用します
    // また、getLocalDevicesにmicrophoneStatusを渡す理由は、マイクの権限なしに動作するようにするためです

    const microphoneStatus: boolean = await peripheralPermissionCheck('microphone')
    const devices = await Room.getLocalDevices('audiooutput', microphoneStatus)
    return devices.map((device) => new Speaker(device.label, device.deviceId))
  }

  public switchDevice(mic: Speaker): void {
    void this.room.switchActiveDevice('audiooutput', mic.id)
  }
}
