/**
 * フェードアウトするログを表示するクラスの抽象
 */
export interface IFadeOutLogRender {
  /**
   * destroy実行後に追加されたログは表示されない
   */
  destroy: () => void
}
