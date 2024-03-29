import { Room } from 'livekit-client'
import { Microphone } from '../../../domain/model/localDevice/microphone'
import { ILocalMicrophoneManager } from '../../../interactor/ILocalDeviceManager/ILocalMicrophoneManager'
import { peripheralPermissionCheck } from './peripheralPermissionCheck'

/**
 * 接続されているマイクを操作する
 * LiveKitのAPIを使って実装
 */
export class LkLocalMicrophoneManager implements ILocalMicrophoneManager {
  private _current: Microphone | null = null

  private constructor(private readonly room: Room) {}

  public static async build(room: Room, activeMic?: Microphone): Promise<LkLocalMicrophoneManager> {
    const localMicManager = new LkLocalMicrophoneManager(room)
    // activeMicが省略されていない場合は_currentにactiveMicを設定
    if (activeMic !== undefined) {
      localMicManager._current = activeMic
      return localMicManager
    }

    // activeMicが省略されている場合はデフォルトの機器を_currentに設定
    const microphones = await localMicManager.getDevices()

    if (microphones.length === 0) {
      // 接続機器がない場合は_currentはnull
      return localMicManager
    } else {
      localMicManager._current = microphones[0]
      return localMicManager
    }
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
    void this.room.switchActiveDevice('audioinput', mic.id).then(() => {
      this._current = mic
    })
  }

  public get current(): Microphone | null {
    return this._current
  }
}
