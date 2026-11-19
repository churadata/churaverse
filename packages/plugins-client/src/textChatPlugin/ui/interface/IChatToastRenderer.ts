import type { TextChat } from '../../model/textChat'

// トースト通知を表示するためのレンダラーのインターフェース
export interface IChatToastRenderer {
  /**
   * トーストを表示する
   * @param textChat 表示するチャットデータ
   */
  show(textChat: TextChat): void
}
