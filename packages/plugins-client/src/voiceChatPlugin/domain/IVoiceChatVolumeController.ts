import type { PlayersRepository } from '@churaverse/player-plugin-client'

export interface IVoiceChatVolumeController {
  /**
   * @param playerId 対象のボイスチャットのプレイヤーid
   * @param volume 設定する音量。0~1の間の値を設定する
   */
  setVolume: (playerId: string, volume: number) => void

  /**
   * idで指定したプレイヤーの音量がupdateAccordingToDistance()によらず常に1になる
   * @param playerId
   */
  activateMegaphone: (playerId: string) => void

  deactivateMegaphone: (playerId: string) => void

  isActiveMegaphoneById: (playerId: string) => boolean

  /**
   * 全プレイヤーの音量を距離に応じて調整
   */
  updateAccordingToDistance: (ownPlayerId: string, players: PlayersRepository) => void
}
