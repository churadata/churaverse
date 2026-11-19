/**
 * 自プレイヤーのボイスチャットの開始・終了を送信するクラス
 */
export interface IVoiceChatSender {
  /**
   * ボイスチャットを開始する.
   * 開始に失敗した場合はfalseを返す
   */
  startStream: () => Promise<boolean>

  /**
   * ボイスチャットを終了する.
   * 終了に失敗した場合はfalseを返す
   */
  stopStream: () => Promise<boolean>
}
