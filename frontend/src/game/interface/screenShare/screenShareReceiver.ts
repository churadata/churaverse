import { RemoteParticipant, RemoteTrack, RemoteTrackPublication, Room, RoomEvent, Track } from 'livekit-client'
import { Interactor } from '../../interactor/Interactor'
import { Scene } from 'phaser'
import { SharedScreenRender } from '../ui/Render/entity/sharedScreenRender'

/**
 * 他プレイヤーの画面共有の開始・終了を受け取るクラス
 */
export class ScreenShareReceiver {
  public constructor(
    private readonly scene: Scene,
    private readonly interactor: Interactor,
    private readonly room: Room
  ) {
    this.room
      .on(RoomEvent.TrackSubscribed, this.onJoin.bind(this))
      .on(RoomEvent.TrackUnsubscribed, this.onLeave.bind(this))
  }

  /**
   * 画面共有開始時に実行される関数
   */
  private onJoin(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (track.kind !== Track.Kind.Video) return

    const remoteTrackPublication = participant.getTrack(Track.Source.ScreenShare)
    if (remoteTrackPublication?.videoTrack == null || remoteTrackPublication.track == null) {
      return
    }

    const mediaStream = new MediaStream()
    mediaStream.addTrack(remoteTrackPublication.videoTrack.mediaStreamTrack)

    void SharedScreenRender.build(this.scene, mediaStream).then((sharedScreenRender) => {
      this.interactor.joinScreenShare(participant.identity, sharedScreenRender)
    })
  }

  /**
   * 画面共有終了時に実行される関数
   */
  private onLeave(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (track.kind !== Track.Kind.Video) return

    this.interactor.leaveScreenShare(participant.identity)
  }
}
