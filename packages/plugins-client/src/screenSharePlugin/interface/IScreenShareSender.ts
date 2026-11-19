/**
 * 自プレイヤーの画面共有の開始・終了を送信するクラス
 */
export interface IScreenShareSender {
  /**
   * 画面共有を開始する.
   * 開始に失敗した場合はfalseを返す
   */
  startStream: () => Promise<boolean>

  /**
   * 画面共有を終了する.
   * 終了に失敗した場合はfalseを返す
   */
  stopStream: () => Promise<boolean>
}
