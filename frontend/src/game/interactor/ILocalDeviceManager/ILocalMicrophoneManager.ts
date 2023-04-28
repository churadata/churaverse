import { Microphone } from '../../domain/model/localDevice/microphone'

/**
 * 接続されているマイクを管理する
 */
export interface ILocalMicrophoneManager {
  /**
   * 接続されているマイク一覧を取得する
   */
  getMicrophones: () => Promise<Microphone[]>

  /**
   * アクティブなマイクを切り替える
   */
  switchMicrophone: (mic: Microphone) => void

  /**
   * 現在アクティブになっているマイク
   * アクティブになっているマイクが存在しない場合はnullを返す
   */
  current: Microphone | null
}
