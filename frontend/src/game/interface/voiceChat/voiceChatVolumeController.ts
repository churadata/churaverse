import { PlayersService } from '../../domain/service/playersService'
import { IVoiceChatVolumeController } from '../../interactor/voiceChat/IVoiceChatVolumeController'

export class VoiceChatVolumeController implements IVoiceChatVolumeController {
  private readonly voices = new Map<string, HTMLAudioElement>()
  /**
   * メガホンをオンにしたプレイヤーのid
   */
  private readonly megaphoneUserIds = new Set<string>()

  public setVolume(playerId: string, volume: number): void {
    const voice = this.voices.get(playerId)

    if (voice === undefined) return

    voice.volume = volume
  }

  public addVoice(playerId: string, voice: HTMLAudioElement): void {
    this.voices.set(playerId, voice)
  }

  public deleteVoice(playerId: string): void {
    this.voices.delete(playerId)
  }

  public activateMegaphone(playerId: string): void {
    this.megaphoneUserIds.add(playerId)
    this.setVolume(playerId, 1)
  }

  public deactivateMegaphone(playerId: string): void {
    this.megaphoneUserIds.delete(playerId)
  }

  public updateAccordingToDistance(ownPlayerId: string, players: PlayersService): void {
    const ownPlayer = players.getPlayer(ownPlayerId)
    if (ownPlayer === undefined) return

    const audibleDistance = 400

    players.forEach((player, id) => {
      if (id === ownPlayerId) return

      // メガホンを使用している場合は音量調整しない
      if (this.megaphoneUserIds.has(id)) return

      const distance = ownPlayer.position.distanceTo(player.position)
      const volume = Math.max(0, audibleDistance - distance) / audibleDistance
      this.setVolume(id, volume)
    })
  }
}
