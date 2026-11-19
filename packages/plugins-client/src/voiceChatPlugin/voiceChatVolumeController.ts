import type { PlayersRepository } from '@churaverse/player-plugin-client'
import type { IAudioService } from './domain/IAudioService'
import type { IVoiceChatVolumeController } from './domain/IVoiceChatVolumeController'

/**
 * 距離減衰・メガホン状態など「意図」を受け取り、AudioService に音量指示を流すコントローラ。
 * HTMLAudioElement を直接触らず、音声処理は AudioPipelineService に委譲する。
 */
export class VoiceChatVolumeController implements IVoiceChatVolumeController {
  /**
   * メガホンをオンにしたプレイヤーの id を保持。
   * メガホン中は距離減衰を無視し常にボリューム 1 とする。
   */
  private readonly megaphoneActiveMap = new Map<string, boolean>()

  /**
   * 距離減衰を 0 にする境界距離。ゲームデザインに合わせて調整可能。
   */
  private readonly audibleDistance = 400

  public constructor(private readonly audioService: IAudioService) {}

  /**
   * AudioService 経由で音量を設定。存在しないチェーンの場合は AudioService 側で無視される。
   */
  public setVolume(playerId: string, volume: number): void {
    this.audioService.setRemoteVolume(playerId, volume)
  }

  public activateMegaphone(playerId: string): void {
    this.megaphoneActiveMap.set(playerId, true)
    this.setVolume(playerId, 1)
  }

  public deactivateMegaphone(playerId: string): void {
    this.megaphoneActiveMap.set(playerId, false)
  }

  public isActiveMegaphoneById(playerId: string): boolean {
    return this.megaphoneActiveMap.get(playerId) ?? false
  }

  /**
   * 自プレイヤーとの距離に応じて各プレイヤーの音量を更新。
   */
  public updateAccordingToDistance(ownPlayerId: string, players: PlayersRepository): void {
    const ownPlayer = players.get(ownPlayerId)
    if (ownPlayer === undefined) return

    for (const playerId of players.getAllId()) {
      if (playerId === ownPlayerId) continue

      const player = players.get(playerId)
      if (player === undefined) continue

      // メガホン使用中は距離減衰をスキップ
      if (this.megaphoneActiveMap.get(playerId) ?? false) continue

      const distance = ownPlayer.position.distanceTo(player.position)

      // 近距離は減衰 0、audibleDistance 以遠で 0 になるような簡易二次関数
      const attenuatedVolume =
        (this.audibleDistance - (distance / Math.sqrt(this.audibleDistance)) ** 2) / this.audibleDistance
      const volume = Math.max(0, attenuatedVolume)

      this.setVolume(playerId, volume)
    }
  }
}
