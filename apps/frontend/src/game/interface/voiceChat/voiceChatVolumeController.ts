import { PlayersService } from '../../domain/service/playersService'
import { IVoiceChatVolumeController } from '../../interactor/voiceChat/IVoiceChatVolumeController'

export class VoiceChatVolumeController implements IVoiceChatVolumeController {
  private readonly voices = new Map<string, HTMLAudioElement>()
  /**
   * メガホンをオンにしたプレイヤーのid
   */
  private readonly megaphoneActiveMap = new Map<string, boolean>()

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
    this.megaphoneActiveMap.set(playerId, true)
    this.setVolume(playerId, 1)
  }

  public deactivateMegaphone(playerId: string): void {
    this.megaphoneActiveMap.set(playerId, false)
  }

  public updateAccordingToDistance(ownPlayerId: string, players: PlayersService): void {
    const ownPlayer = players.getPlayer(ownPlayerId)
    if (ownPlayer === undefined) return

    const audibleDistance = 400

    players.forEach((player, id) => {
      if (id === ownPlayerId) return

      // メガホンを使用している場合は音量調整しない
      if (this.megaphoneActiveMap.get(id) ?? false) return

      const distance = ownPlayer.position.distanceTo(player.position)

      const attenuatedVolume = (audibleDistance - (distance / Math.sqrt(audibleDistance)) ** 2) / audibleDistance
      const volume = Math.max(0, attenuatedVolume)

      this.setVolume(id, volume)
    })
  }
}
