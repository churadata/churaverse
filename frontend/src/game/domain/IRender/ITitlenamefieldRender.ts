export interface ITitleNameFieldRender {
  /**
   * 名前の取得
   */

  getName: () => string

  /**
   * 名前に設定可能な文字列であるかの判定
   */
  validate: () => boolean
}
