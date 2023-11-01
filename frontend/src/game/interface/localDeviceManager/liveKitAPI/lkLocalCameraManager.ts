import { Room } from 'livekit-client'
import { Camera } from '../../../domain/model/localDevice/camera'
import { ILocalCameraManager } from '../../../interactor/ILocalDeviceManager/ILocalCameraManager'
import { peripheralPermissionCheck } from './peripheralPermissionCheck'

/**
 * 接続されているカメラを操作する
 * LiveKitのAPIを使って実装
 */
export class LkLocalCameraManager implements ILocalCameraManager {
  private _current: Camera | null = null

  public constructor(private readonly room: Room) {}

  public static async build(room: Room, activeMic?: Camera): Promise<LkLocalCameraManager> {
    const localMicManager = new LkLocalCameraManager(room)
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

  public async getDevices(): Promise<Camera[]> {
    // Room.getLocalDevicesはMediaDevices.enumerateDevices()と同じ要素を返すので、
    // 最初の要素がデフォルトのキャプチャ機器
    // https://docs.livekit.io/client-sdk-js/index.html#device-management-apis
    // https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/enumerateDevices#%E8%BF%94%E5%80%A4

    const cameraStatus: boolean = await peripheralPermissionCheck('camera')
    const devices = await Room.getLocalDevices('videoinput', cameraStatus)
    return devices.map((device) => new Camera(device.label, device.deviceId))
  }

  public switchDevice(camera: Camera): void {
    void this.room.switchActiveDevice('videoinput', camera.id).then(() => {
      this._current = camera
    })
  }

  public get current(): Camera | null {
    return this._current
  }
}
