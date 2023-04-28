import { Room } from 'livekit-client'
import { Speaker } from '../../domain/model/localDevice/speaker'
import { ILocalSpeakerManager } from '../../interactor/ILocalDeviceManager/ILocalSpeakerManager'

export class LocalSpeakerManager implements ILocalSpeakerManager {
  private _current: Speaker | null = null

  private constructor(private readonly room: Room) {}

  public static async build(room: Room, activeSpeaker?: Speaker): Promise<LocalSpeakerManager> {
    const localMicManager = new LocalSpeakerManager(room)
    // activeSpeakerが省略されていない場合は_currentにactiveSpeakerを設定
    if (activeSpeaker !== undefined) {
      localMicManager._current = activeSpeaker
      return localMicManager
    }

    // activeSpeakerが省略されている場合はデフォルトの機器を_currentに設定
    const speakers = await localMicManager.getSpeakers()

    if (speakers.length === 0) {
      // 接続機器がない場合は_currentはnull
      return localMicManager
    } else {
      localMicManager._current = speakers[0]
      return localMicManager
    }
  }

  public async getSpeakers(): Promise<Speaker[]> {
    // Room.getLocalDevicesはMediaDevices.enumerateDevices()と同じ要素を返すので、
    // 最初の要素がデフォルトのキャプチャ機器
    // https://docs.livekit.io/client-sdk-js/index.html#device-management-apis
    // https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/enumerateDevices#%E8%BF%94%E5%80%A4
    const devices = await Room.getLocalDevices('audiooutput', true)
    return devices.map((device) => new Speaker(device.label, device.deviceId))
  }

  public switchSpeaker(mic: Speaker): void {
    void this.room.switchActiveDevice('audiooutput', mic.id).then(() => {
      this._current = mic
    })
  }

  public get current(): Speaker | null {
    return this._current
  }
}
