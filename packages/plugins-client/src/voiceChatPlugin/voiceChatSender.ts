import type { NetworkPluginStore } from '@churaverse/network-plugin-client'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import {
  type LocalAudioTrack,
  type LocalParticipant,
  type LocalTrackPublication,
  type Participant,
  type Room,
  RoomEvent,
  Track,
  type TrackPublication,
} from 'livekit-client'
import { RnnoiseMicPipeline } from './audio/rnnoiseMicPipeline'
import type { IAudioService } from './domain/IAudioService'
import type { IVoiceChatSender } from './domain/IVoiceChatSender'
import { MuteEvent } from './event/muteEvent'
import { UnmuteEvent } from './event/unmuteEvent'
import { ToggleMicMessage } from './message/toggleMicMessage'
import type { VoiceChatPluginStore } from './store/defVoiceChatPluginStore'

export class VoiceChatSender implements IVoiceChatSender {
  private readonly networkPluginStore!: NetworkPluginStore<IMainScene>
  private readonly voiceChatPluginStore!: VoiceChatPluginStore
  // ローカルのマイクストリームを RNNoise で処理して MediaStreamTrack を提供するパイプライン
  private readonly micPipeline = new RnnoiseMicPipeline()
  private micPublication?: LocalTrackPublication
  // start/stop の多重実行を防ぐためのフラグ
  private isStarting = false
  private isStopping = false
  public constructor(
    private readonly room: Room,
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly store: Store<IMainScene>,
    private readonly ownPlayerId: string,
    private readonly audioService?: IAudioService
  ) {
    room.on(RoomEvent.LocalTrackPublished, this.onStartStream.bind(this))
    room.on(RoomEvent.LocalTrackUnpublished, this.onStopStream.bind(this))
    room.on(RoomEvent.TrackUnmuted, this.onUnmuted.bind(this))
    room.on(RoomEvent.TrackMuted, this.onMuted.bind(this))
    this.networkPluginStore = this.store.of('networkPlugin')
    this.voiceChatPluginStore = this.store.of('voiceChatPlugin')
  }

  private onStartStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    this.unmute(publication.source, participant.identity)
    participant.addListener('isSpeakingChanged', (_speaking) => {
      const playerMicIcon = this.voiceChatPluginStore.playerVoiceChatUis.get(participant.identity)?.playerMicIcon
      playerMicIcon?.setAlphaToMicIcon(participant.audioLevel * 5)
    })
  }

  private onStopStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    this.mute(publication.source, participant.identity)
  }

  private onUnmuted(publication: TrackPublication, participant: Participant): void {
    this.unmute(publication.source, participant.identity)
  }

  private onMuted(publication: TrackPublication, participant: Participant): void {
    this.mute(publication.source, participant.identity)
  }

  private unmute(source: Track.Source, identity: string): void {
    if (source !== Track.Source.Microphone) return
    if (identity !== this.ownPlayerId) return
    this.eventBus.post(new UnmuteEvent(identity))
    this.networkPluginStore.messageSender.send(new ToggleMicMessage({ playerId: identity, isUnmute: true }))
  }

  private mute(source: Track.Source, identity: string): void {
    if (source !== Track.Source.Microphone) return
    if (identity !== this.ownPlayerId) return
    this.eventBus.post(new MuteEvent(identity))
    this.networkPluginStore.messageSender.send(new ToggleMicMessage({ playerId: identity, isUnmute: false }))
  }

  public async startStream(): Promise<boolean> {
    // 既に開始処理中であれば現在の状態をそのまま返す
    if (this.isStarting) return this.micPublication?.track !== undefined
    this.isStarting = true
    try {
      // LiveKit 側に既にマイクトラックが存在する場合、
      // そのまま publishTrack すると「同じ Source のトラックが二重に publish される」問題が発生する。
      // 事前に unpublish + stop しておき、常に 1 本のマイクトラックだけが存在する状態に揃える。
      const existingMic = this.room.localParticipant.getTrackPublication(Track.Source.Microphone)
      if (existingMic?.track !== undefined) {
        await this.room.localParticipant.unpublishTrack(existingMic.track as LocalAudioTrack)
        existingMic.track.stop()
      }

      const processedTrack = await this.micPipeline.start()
      this.micPublication = await this.room.localParticipant.publishTrack(processedTrack, {
        source: Track.Source.Microphone,
        name: 'microphone-processed',
      })
      console.info('[MicPipeline] published track', this.micPublication?.track?.mediaStreamTrack?.getSettings())
      return this.micPublication.track !== undefined
    } catch (error) {
      console.error('Failed to start microphone pipeline', error)
      // パイプラインの立ち上げに失敗した場合でも、
      // 完全にマイクが使えなくなると困るため LiveKit のデフォルト実装にフォールバックする。
      await this.room.localParticipant.setMicrophoneEnabled(true)
      this.micPublication = this.room.localParticipant.getTrackPublication(Track.Source.Microphone)
      return this.room.localParticipant.isMicrophoneEnabled
    } finally {
      this.isStarting = false
    }
  }

  public async stopStream(): Promise<boolean> {
    // stop が多重で呼ばれても 1 回だけ実行されるようにする
    if (this.isStopping) return true
    this.isStopping = true
    try {
      const publication = this.micPublication ?? this.room.localParticipant.getTrackPublication(Track.Source.Microphone)
      const track = publication?.track as LocalAudioTrack | undefined
      if (track !== undefined) {
        try {
          await this.room.localParticipant.unpublishTrack(track)
        } catch (e) {
          console.warn('unpublishTrack failed, continue teardown', e)
        }
        try {
          track.stop?.()
        } catch (e) {
          console.warn('stop track failed, continue teardown', e)
        }
      }
    } finally {
      this.micPublication = undefined
      // AudioContext / Worklet / getUserMedia ストリームなどをまとめて解放
      await this.micPipeline.stop()
      // LiveKit 側の状態も明示的にオフにしておく
      await this.room.localParticipant.setMicrophoneEnabled(false)
      this.isStopping = false
    }

    // 終了失敗=isMicrophoneEnabledがtrueの時なので, isMicrophoneEnabledの否定を返す
    return !this.room.localParticipant.isMicrophoneEnabled
  }
}
