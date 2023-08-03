import {
  Participant,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
  TrackPublication,
} from 'livekit-client'
import { Interactor } from '../../interactor/Interactor'
import { Scene } from 'phaser'

/**
 * 他プレイヤーのWebカメラの開始・終了を受け取るクラス
 */
export class CameraVideoReceiver {
  public constructor(
    private readonly scene: Scene,
    private readonly interactor: Interactor,
    private readonly room: Room
  ) {
    this.room
      .on(RoomEvent.TrackSubscribed, this.onJoin.bind(this))
      .on(RoomEvent.TrackUnmuted, this.onUnmute.bind(this))
      .on(RoomEvent.TrackUnsubscribed, this.onLeave.bind(this))
      .on(RoomEvent.TrackMuted, this.onMute.bind(this))
  }

  /**
   * 入室後初めてWebカメラをONにした時に実行される関数
   */
  private onJoin(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (track.source !== Track.Source.Camera) return

    const remoteTrackPublication = participant.getTrack(Track.Source.Camera)
    if (remoteTrackPublication?.videoTrack == null || remoteTrackPublication.track == null || track.isMuted) {
      return
    }

    const mediaStream = new MediaStream()
    mediaStream.addTrack(remoteTrackPublication.videoTrack.mediaStreamTrack)

    this.interactor.joinCameraVideo(participant.identity, mediaStream)
  }

  /**
   * 通信切断時に実行される関数
   */
  private onLeave(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (track.source !== Track.Source.Camera) return
    this.interactor.leaveCameraVideo(participant.identity)
  }

  /**
   * WebカメラON時に実行される関数
   */
  private onUnmute(publication: TrackPublication, participant: Participant): void {
    if (publication.source !== Track.Source.Camera) return

    const remoteTrackPublication = participant.getTrack(Track.Source.Camera)
    if (remoteTrackPublication?.videoTrack == null || remoteTrackPublication.track == null) {
      return
    }

    const mediaStream = new MediaStream()
    mediaStream.addTrack(remoteTrackPublication.videoTrack.mediaStreamTrack)

    this.interactor.joinCameraVideo(participant.identity, mediaStream)
  }

  /**
   * WebカメラOFF時に実行される関数
   */
  private onMute(publication: TrackPublication, participant: Participant): void {
    if (publication.source !== Track.Source.Camera) return
    this.interactor.leaveCameraVideo(participant.identity)
  }
}
