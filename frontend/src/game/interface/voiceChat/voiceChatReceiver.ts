import { RemoteParticipant, RemoteTrack, RemoteTrackPublication, Room, RoomEvent, Track } from 'livekit-client'
import { Interactor } from '../../interactor/Interactor'

/**
 * 他プレイヤーのボイスチャットの開始・終了を受け取るクラス
 */
export class VoiceChatReceiver {
  public constructor(private readonly interactor: Interactor, private readonly room: Room) {
    this.room
      .on(RoomEvent.TrackSubscribed, this.onJoin.bind(this))
      .on(RoomEvent.TrackUnsubscribed, this.onLeave.bind(this))
  }

  /**
   * ボイスチャット開始時に実行される関数
   */
  private onJoin(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (track.source !== Track.Source.Microphone) return

    const remoteTrackPublication = participant.getTrack(Track.Source.Microphone)
    if (remoteTrackPublication?.audioTrack == null || remoteTrackPublication.track == null) {
      return
    }

    const voice = remoteTrackPublication.track.attach()

    this.interactor.joinVoiceChat(participant.identity, voice)

    remoteTrackPublication.addListener('unmuted', () => {
      this.interactor.onUnmute(participant.identity)
    })

    remoteTrackPublication.addListener('muted', () => {
      this.interactor.onMute(participant.identity)
    })
  }

  /**
   * ボイスチャット終了時に実行される関数
   */
  private onLeave(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (track.source !== Track.Source.Microphone) return

    participant.getTrack(Track.Source.Microphone)?.track?.detach()
    this.interactor.leaveVoiceChat(participant.identity)
  }
}
