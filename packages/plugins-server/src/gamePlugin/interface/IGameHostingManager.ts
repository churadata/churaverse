export interface IGameHostingManager {
  /**
   * プレイヤーの参加可否を設定する
   * @param playerId 参加するプレイヤーのID
   * @param willJoin 参加する場合はtrue、退出する場合はfalse
   * @returns
   */
  set: (playerId: string, willJoin: boolean) => void

  /**
   * 全プレイヤーが参加/不参加の回答を済ませているかどうか
   * @returns 全プレイヤーが参加/不参加の回答を済ませているかどうか
   */
  isAllPlayersResponded: () => boolean

  /**
   * 参加しているプレイヤーID配列を取得する
   * @returns 参加しているプレイヤーID配列
   */
  getJoinedPlayerIds: () => string[]

  /**
   * タイムアウト処理を実行する
   * @returns 全てのプレイヤーを回答済みにする
   */
  timeoutResponse: () => void
}
