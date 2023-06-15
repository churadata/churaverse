import { Microphone } from '../../domain/model/localDevice/microphone'

/**
 * マイクを切り替えるセレクタ
 */
export interface IMicSelector {
  /**
   * 選択肢の内容を更新する
   */
  updateLocalMicrophones: (microphones: Microphone[]) => void
}
