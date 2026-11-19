import type { IFocusableRenderer } from './IFocusableRenderer'

/**
 * フォーカス切り替えの対象を保持するRepositoryのinterface
 */
export interface IFocusTargetRepository {
  /**
   * フォーカス対象の追加
   */
  addFocusTarget: (target: IFocusableRenderer) => void

  /**
   * フォーカス対象から削除
   */
  removeFocusTarget: (target: IFocusableRenderer) => void
}
