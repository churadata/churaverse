import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import {
  type LocalParticipant,
  type LocalTrack,
  type LocalTrackPublication,
  type Room,
  RoomEvent,
  Track,
  type VideoCaptureOptions,
  VideoPresets,
} from 'livekit-client'
import type {
  IWebCameraIdDebugDetailScreen,
  IWebCameraMyStatusDebugDetailScreen,
} from './debugScreen/IDebugScreen/IWebCameraInfoDebugScreen'
import type { TriggerVideoSendingEvent } from './event/event'
import type { CameraEffectId, IVideoSender } from './interface/IVideoSender'
import '@churaverse/popup-screen-list-plugin-client'
import type { EffectManager } from './effectManager'
import { VideoChatStatusChangedEvent } from './event/videoChatStatusChangedEvent'

export class CameraVideoSender implements IVideoSender {
  private localVideoTrack: LocalTrack | undefined = undefined

  public constructor(
    private readonly room: Room,

    private readonly store: Store<IMainScene>,
    private readonly bus: IEventBus<IMainScene>,
    private readonly effectManager: EffectManager,
    private readonly webCameraIdDebugDetailScreen: IWebCameraIdDebugDetailScreen,
    private readonly webCameraMyStatusDebugDetailScreen: IWebCameraMyStatusDebugDetailScreen
  ) {
    this.room
      .on(RoomEvent.LocalTrackPublished, this.onStartStream.bind(this))
      .on(RoomEvent.LocalTrackUnpublished, this.onStopStream.bind(this))
      .on(RoomEvent.ActiveDeviceChanged, this.onActiveDeviceChanged.bind(this))
  }

  /**
   * カメラが切り替わった際に、Processorが正しく切り替わらないため、一度切ってから再度ストリーミングを開始する。
   */
  private onActiveDeviceChanged(): void {
    void Promise.resolve().then(async () => {
      if (this.localVideoTrack != null) {
        await this.localVideoTrack?.stopProcessor()
        const track = this.room.localParticipant.getTrackPublication(Track.Source.Camera)?.track
        if (track != null) {
          await this.stopStream()
          await this.startStream()
        }
      }
    })
  }

  private onStartStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    if (publication.kind !== 'video') return
    const track = publication.track
    if (track == null) return
    if (publication.source !== Track.Source.Camera) return
    this.store.of('popUpScreenList').addScreen(participant.identity, track.attach() as HTMLVideoElement)
  }

  private onStopStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    if (publication.kind !== 'video') return
    if (publication.source !== Track.Source.Camera) return
    this.store.of('popUpScreenList').removeScreen(participant.identity)
  }

  public handleVideoSendTrigger(ev: TriggerVideoSendingEvent): void {
    const { status: isActive } = ev
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    if (isActive) {
      void this.startStream().then((result) => {
        if (result) {
          this.webCameraIdDebugDetailScreen.update(ownPlayerId)
          this.webCameraMyStatusDebugDetailScreen.update(true)
        }
      })
    } else {
      void this.stopStream().then((result) => {
        if (result) {
          this.webCameraIdDebugDetailScreen.update(ownPlayerId)
          this.webCameraMyStatusDebugDetailScreen.update(false)
        }
      })
    }
  }

  /**
   * カメラ映像を有効にし、エフェクトを適用した映像のストリーミングを開始する。
   * @returns
   */
  public async startStream(): Promise<boolean> {
    const videoCaptureOptions: VideoCaptureOptions = {
      resolution: VideoPresets.h360,
      deviceId: { exact: this.room.getActiveDevice('videoinput') },
    }

    await this.room.localParticipant.setCameraEnabled(true, videoCaptureOptions)

    await this.setEffect(this.effectManager.getEffectMode())

    const track = this.room.localParticipant.getTrackPublication(Track.Source.Camera)?.track
    if (track == null) return false
    this.localVideoTrack = track
    this.bus.post(new VideoChatStatusChangedEvent())
    return this.room.localParticipant.isCameraEnabled
  }

  public async stopStream(): Promise<boolean> {
    if (this.localVideoTrack != null) {
      await this.localVideoTrack.stopProcessor()
      await this.room.localParticipant.setCameraEnabled(false)
      this.localVideoTrack = undefined
    }
    this.bus.post(new VideoChatStatusChangedEvent())
    // 終了失敗=isCameraEnabledがtrueの時なので, isCameraEnabledの否定を返す
    return !this.room.localParticipant.isCameraEnabled
  }

  public async setEffect(mode: CameraEffectId): Promise<void> {
    this.effectManager.setEffectMode(mode)
    const effect = this.effectManager.getEffect()
    if (this.localVideoTrack != null) {
      if (mode === 'dummy') await this.localVideoTrack.stopProcessor()
      else if (effect != null) await this.localVideoTrack.setProcessor(effect)
    }
  }
}
