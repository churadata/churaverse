/**
 * 自プレイヤーのWebカメラ映像の開始・終了を送信するクラス
 */
export interface ICameraVideoSender {
  /**
   * Webカメラ映像を開始する.
   * 開始に失敗した場合はfalseを返す
   */
  startStream: () => Promise<boolean>

  /**
   * Webカメラ映像を終了する.
   * 終了に失敗した場合はfalseを返す
   */
  stopStream: () => Promise<boolean>
}
