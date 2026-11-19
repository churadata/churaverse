import type { IDialog } from '@churaverse/core-ui-plugin-client'

/**
 * チャットダイアログのインターフェース
 * switcherとの互換性を保つため IDialog<any> を継承
 */
export interface ITextChatDialog extends IDialog<any> {
  open(): void
  close(): void
  readonly isOpen: boolean
}

// DialogMap への登録
declare module '@churaverse/core-ui-plugin-client' {
  export interface DialogMap {
    chat: ITextChatDialog
  }
}
