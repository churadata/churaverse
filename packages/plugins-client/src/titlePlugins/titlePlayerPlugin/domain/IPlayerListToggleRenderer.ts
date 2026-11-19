import type { PlayerNameColor } from '../message/titlePriorPlayerDataMessage'

export interface IPlayerListToggleRenderer {
  /**
   * 参加中プレイヤーの一覧を更新する。ヘッダーの人数表示と、開いている場合はパネルの中身を最新化する
   */
  update: (players: PlayerNameColor[]) => void
}
