import { Room } from 'livekit-client'
import { Camera } from '../../domain/localDevice/camera'
import type { ILocalCameraManager } from '../../interface/ILocalDeviceManager/ILocalCameraManager'
import { peripheralPermissionCheck } from '../../peripheralPermissionCheck'

/**
 * 接続されているカメラを操作する
 * LiveKitのAPIを使って実装
 */
export class LkLocalCameraManager implements ILocalCameraManager {
  public constructor(private readonly room: Room) {}

  public async getCurrent(): Promise<Camera | null> {
    const devices = await this.getDevices()
    if (devices.length === 0) {
      return null
    }

    return devices[0]
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
    void this.asyncSwitchDevice(camera)
  }

  private async asyncSwitchDevice(camera: Camera): Promise<void> {
    const active = this.room.localParticipant.isCameraEnabled
    await this.room.localParticipant.setCameraEnabled(false)
    await this.room.switchActiveDevice('videoinput', camera.id)
    await this.room.localParticipant.setCameraEnabled(active)
  }
}
