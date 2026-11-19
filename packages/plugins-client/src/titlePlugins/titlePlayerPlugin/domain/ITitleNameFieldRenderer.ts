export interface ITitleNameFieldRenderer {
  /**
   * 名前の取得
   */
  getName: () => string

  /**
   * 名前に設定可能な文字列であるかの判定
   * @return エラーメッセージの配列。エラーがない場合は空配列を返す。
   */
  validate: () => string[]
}
