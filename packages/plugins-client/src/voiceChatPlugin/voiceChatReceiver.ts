import type { IEventBus, IMainScene } from 'churaverse-engine-client'
import {
  RemoteAudioTrack,
  type RemoteParticipant,
  type RemoteTrack,
  type RemoteTrackPublication,
  type Room,
  RoomEvent,
  Track,
} from 'livekit-client'
import type { IAudioService } from './domain/IAudioService'
import { MuteEvent } from './event/muteEvent'
import { UnmuteEvent } from './event/unmuteEvent'
import type { PlayerVoiceChatIcons } from './ui/playerVoiceChatIcons'

/**
 * 他プレイヤーのボイスチャットの開始・終了を受け取るクラス
 */
export class VoiceChatReceiver {
  public constructor(
    private readonly room: Room,
    private readonly audioService: IAudioService,
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly playerVoiceChatUis: Map<string, PlayerVoiceChatIcons>
  ) {
    this.room
      .on(RoomEvent.TrackSubscribed, this.onJoin.bind(this))
      .on(RoomEvent.TrackUnsubscribed, this.onLeave.bind(this))
  }

  /**
   * ボイスチャット開始時に実行される関数
   * LiveKit が source を Unknown と扱っても track.kind=audio なら受ける。
   */
  private onJoin(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    // LiveKit が source を Unknown として扱うケースがあるため、音声トラックなら受ける
    if (track.kind !== Track.Kind.Audio) return

    if (!(track instanceof RemoteAudioTrack)) return
    const audioTrack = publication.audioTrack instanceof RemoteAudioTrack ? publication.audioTrack : track

    // LiveKit の RemoteAudioTrack を AudioService に委譲して Web Audio グラフへ接続
    this.audioService.addRemoteTrack(participant.identity, audioTrack)

    publication.addListener('subscriptionStatusChanged', () => {
      if (!track.isMuted) {
        this.eventBus.post(new UnmuteEvent(participant.identity))
      }
    })

    publication.addListener('unmuted', () => {
      this.eventBus.post(new UnmuteEvent(participant.identity))
    })

    publication.addListener('muted', () => {
      this.eventBus.post(new MuteEvent(participant.identity))
    })

    participant.addListener('isSpeakingChanged', () => {
      const playerMicIcon = this.playerVoiceChatUis.get(participant.identity)?.playerMicIcon
      playerMicIcon?.setAlphaToMicIcon(participant.audioLevel * 5)
    })
  }

  /**
   * ボイスチャット終了時に実行される関数
   */
  private onLeave(track: RemoteTrack, _publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (track.kind !== Track.Kind.Audio) return

    participant.getTrackPublication(Track.Source.Microphone)?.track?.detach()
    this.audioService.removeRemoteTrack(participant.identity)
  }
}
