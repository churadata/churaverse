import type { IEventBus, IMainScene } from 'churaverse-engine-client'
import {
  type RemoteParticipant,
  type RemoteTrack,
  type RemoteTrackPublication,
  type Room,
  RoomEvent,
  Track,
} from 'livekit-client'
import { StartScreenShare } from './event/startScreenShareEvent'
import { StopScreenShare } from './event/stopScreenShareEvent'

/**
 * 他プレイヤーの画面共有の開始・終了を受け取るクラス
 */
export class ScreenShareReceiver {
  public constructor(
    private readonly room: Room,
    private readonly eventBus: IEventBus<IMainScene>
  ) {
    this.room
      .on(RoomEvent.TrackSubscribed, this.onJoin.bind(this))
      .on(RoomEvent.TrackUnsubscribed, this.onLeave.bind(this))
  }

  /**
   * 画面共有開始時に実行される関数
   */
  private onJoin(track: RemoteTrack, _publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (track.source !== Track.Source.ScreenShare) return

    const mediaStream = new MediaStream()
    mediaStream.addTrack(track.mediaStreamTrack)

    const video = document.createElement('video')
    video.srcObject = mediaStream
    this.eventBus.post(new StartScreenShare(participant.identity, video))
  }

  /**
   * 画面共有終了時に実行される関数
   */
  private onLeave(track: RemoteTrack, _publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (track.source !== Track.Source.ScreenShare) return

    this.eventBus.post(new StopScreenShare(participant.identity))
  }
}
