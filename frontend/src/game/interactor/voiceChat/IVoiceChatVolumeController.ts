import { PlayersService } from '../../domain/service/playersService'

export interface IVoiceChatVolumeController {
  /**
   * @param playerId 対象のボイスチャットのプレイヤーid
   * @param volume 設定する音量。0~1の間の値を設定する
   */
  setVolume: (playerId: string, volume: number) => void

  /**
   * 音量をコントロールする対象の音声を追加する
   */
  addVoice: (playerId: string, voice: HTMLAudioElement) => void

  /**
   * 音量をコントロールする対象から除外する
   */
  deleteVoice: (playerId: string) => void

  /**
   * idで指定したプレイヤーの音量がupdateAccordingToDistance()によらず常に1になる
   * @param playerId
   */
  activateMegaphone: (playerId: string) => void

  deactivateMegaphone: (playerId: string) => void

  /**
   * 全プレイヤーの音量を距離に応じて調整
   */
  updateAccordingToDistance: (ownPlayerId: string, players: PlayersService) => void
}
