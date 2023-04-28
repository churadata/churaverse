import { Speaker } from '../../domain/model/localDevice/speaker'

/**
 * 接続されているスピーカーを管理する
 */
export interface ILocalSpeakerManager {
  /**
   * 接続されているスピーカー一覧を取得する
   */
  getSpeakers: () => Promise<Speaker[]>

  /**
   * アクティブなスピーカーを切り替える
   */
  switchSpeaker: (mic: Speaker) => void

  /**
   * 現在アクティブになっているスピーカー
   * アクティブになっているスピーカーが存在しない場合はnullを返す
   */
  current: Speaker | null
}
