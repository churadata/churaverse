/**
 * 画面共有を開始/停止するボタン
 */
export interface IScreenShareButton {
  /** buttonが有効になったときの見た目の変化 */
  activateButton: () => void

  /** buttonが無効になったときの見た目の変化 */
  deactivateButton: () => void
}
