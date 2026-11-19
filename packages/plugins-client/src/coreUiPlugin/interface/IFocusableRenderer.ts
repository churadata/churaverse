/**
 *フォーカス可能なレンダーを表すインターフェイス
 */
export interface IFocusableRenderer {
  /**
   * 追従を開始
   */
  focus: () => void
}
