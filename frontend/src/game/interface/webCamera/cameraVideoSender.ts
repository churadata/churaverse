import { LocalParticipant, LocalTrackPublication, Room, RoomEvent, Track, VideoCaptureOptions } from 'livekit-client'
import { Scene } from 'phaser'
import { Interactor } from '../../interactor/Interactor'
import { ICameraVideoSender } from '../../interactor/webCamera/ICameraVideoSender'

export class CameraVideoSender implements ICameraVideoSender {
  private interactor?: Interactor

  public constructor(private readonly scene: Scene, private readonly room: Room) {
    this.room
      .on(RoomEvent.LocalTrackPublished, this.onStartStream.bind(this))
      .on(RoomEvent.LocalTrackUnpublished, this.onStopStream.bind(this))
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /**
   * 自プレイヤーの画面共有を開始した時に実行される
   */
  private onStartStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    if (publication.source !== Track.Source.Camera) return
    const remoteTrackPublication = participant.getTrack(Track.Source.Camera)
    if (remoteTrackPublication?.videoTrack == null || remoteTrackPublication.track == null) {
      return
    }

    const mediaStream = new MediaStream()
    mediaStream.addTrack(remoteTrackPublication.videoTrack.mediaStreamTrack)

    this.interactor?.joinCameraVideo(participant.identity, mediaStream)
  }

  /**
   * 通信切断時に実行される
   */
  private onStopStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    if (publication.source !== Track.Source.Camera) return
    this.interactor?.leaveCameraVideo(participant.identity)
  }

  public async startStream(): Promise<boolean> {
    const videoCaptureOptions: VideoCaptureOptions = { resolution: { width: 1280, height: 720 } }
    await this.room.localParticipant.setCameraEnabled(true, videoCaptureOptions)

    return this.room.localParticipant.isCameraEnabled
  }

  public async stopStream(): Promise<boolean> {
    await this.room.localParticipant.setCameraEnabled(false)

    // 終了失敗=isCameraEnabledがtrueの時なので, isCameraEnabledの否定を返す
    return !this.room.localParticipant.isCameraEnabled
  }
}
