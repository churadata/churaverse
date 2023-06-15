import { IFocusableRender } from './IFocusableRender'

/**
 * 共有された画面を描画する
 */
export interface ISharedScreenRender extends IFocusableRender {
  readonly video: MediaStream
  destroy: () => void

  /**
   * 共有画面への追従を開始
   */
  focus: () => void
}
