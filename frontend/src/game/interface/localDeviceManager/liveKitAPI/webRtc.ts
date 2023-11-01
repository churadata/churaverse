import { LocalParticipant, Participant, Room, RoomOptions, Track, VideoPresets } from 'livekit-client'
import { IPlayerRender } from '../../../domain/IRender/IPlayerRender'

/**
 * backend_livekitが返すアクセストークンのJSON
 */
interface AccessTokenResponse {
  token: string
}

export class WebRtc {
  public readonly room: Room

  public constructor(ownPlayerId: string) {
    const roomOptions: RoomOptions = {
      // automatically manage subscribed video quality
      // オンにしてはいけない。Phaserに映像が上手く流せなくなるため。
      // Phaserとの相性が悪いのか、実装方法が悪いのか、streamがずっとpause状態のままになってしまう。
      adaptiveStream: false,

      // optimize publishing bandwidth and CPU for published tracks
      dynacast: true,

      // default capture settings
      videoCaptureDefaults: {
        resolution: VideoPresets.h1080.resolution,
      },
    }
    this.room = new Room(roomOptions)

    void this.connect(ownPlayerId)
  }

  private async connect(ownPlayerId: string): Promise<void> {
    try {
      const token = await this.getAccessToken(ownPlayerId)
      await this.room.connect(`${import.meta.env.VITE_LIVEKIT_URL ?? 'ws://localhost:8080/livekit'}`, token)

      console.log(`connected to room. roomName: ${this.room.name}`)
    } catch {
      console.error(`Failed to connect to room.`)
      window.alert('chromeでの利用を推奨します')
    }
  }

  private async getAccessToken(ownPlayerId: string): Promise<string> {
    const params = {
      roomName: 'room1',
      userName: ownPlayerId,
    }
    const query = new URLSearchParams(params).toString()
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_LIVEKIT_URL ?? 'http://localhost:8080/backend_livekit'}/?${query}`
    )
    const data = (await res.json()) as AccessTokenResponse
    return data.token
  }

  public async disconnect(): Promise<void> {
    await this.room.disconnect()
  }

  public setInitialState(playerRenders: Map<string, IPlayerRender>): void {
    /*
     * 自分のプレイヤーのマイクアイコン初期設定
     * On/Off切り替え時の処理はIneractorのStartVoiceStreamで管理する
     */
    this.configParticipant(this.room.localParticipant, playerRenders)
    console.log(this.room.participants)
    /*
     * 自分以外のプレイヤーのマイクアイコン設定
     */
    this.room.participants.forEach((participant) => {
      this.configParticipant(participant, playerRenders)
    })

    this.room.on('participantConnected', (participant) => {
      this.configParticipant(participant, playerRenders)
    })
  }

  private configParticipant(
    participant: LocalParticipant | Participant,
    playerRenders: Map<string, IPlayerRender>
  ): void {
    const track = participant.getTrack(Track.Source.Microphone)
    const participantRender = playerRenders.get(participant.identity)

    if (participantRender != null) {
      // アイコン初期描画
      if (track === null || track === undefined) {
        // まだTrackがPublishされていない場合（新規プレイヤー、マイク許可後のプレイヤー）アイコンをオフにする
        participantRender.handleMicIcons(false)
      } else {
        // 既存プレイヤーのマイクアイコンを決定
        if (track.isMuted) {
          participantRender.handleMicIcons(false)
        } else {
          participantRender.handleMicIcons(true)
        }
      }
    }

    participant.addListener('isSpeakingChanged', (speaking) => {
      participantRender?.setAlphaToMicIcon(participant.audioLevel * 5)
    })
  }
}
