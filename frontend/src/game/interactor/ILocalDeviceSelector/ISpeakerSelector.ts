import { Speaker } from '../../domain/model/localDevice/speaker'

/**
 * スピーカを切り替えるセレクタ
 */
export interface ISpeakerSelector {
  /**
   * 選択肢の内容を更新する
   */
  updateLocalSpeakers: (speakers: Speaker[]) => void
}
