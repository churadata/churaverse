/**
 * フェードアウトするログを表示するクラスの抽象
 */
export interface IFadeOutLogRenderer {
  /**
   * destroy実行後に追加されたログは表示されない
   */
  destroy: () => void
  add: (message: string, x: number, y: number) => void
}
