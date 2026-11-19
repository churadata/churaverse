import type { IFocusableRenderer } from '@churaverse/core-ui-plugin-client'

/**
 * ワールドの地面に映像を描画する
 */
export interface IGroundScreenRenderer extends IFocusableRenderer {
  readonly video: HTMLVideoElement
  destroy: () => void

  /**
   * 映像画面への追従を開始
   */
  focus: () => void
}
