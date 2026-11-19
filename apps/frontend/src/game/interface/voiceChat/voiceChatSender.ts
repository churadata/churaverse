import { Room } from 'livekit-client'
import { IVoiceChatSender } from '../../interactor/voiceChat/IVoiceChatSender'

export class VoiceChatSender implements IVoiceChatSender {
  public constructor(private readonly room: Room) {}

  public async startStream(): Promise<boolean> {
    await this.room.localParticipant.setMicrophoneEnabled(true)
    return this.room.localParticipant.isMicrophoneEnabled
  }

  public async stopStream(): Promise<boolean> {
    await this.room.localParticipant.setMicrophoneEnabled(false)

    // 終了失敗=isMicrophoneEnabledがtrueの時なので, isMicrophoneEnabledの否定を返す
    return !this.room.localParticipant.isMicrophoneEnabled
  }
}
