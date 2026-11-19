import { Dialog, type Props } from '@churaverse/core-ui-plugin-client'
import type { ITextChatDialog } from '../interface/ITextChatDialog'
import type { TextChatSection } from './textChatSection'

/**
 * プレイヤーの設定に関するUI
 */
export class TextChatDialog extends Dialog<TextChatSection> implements ITextChatDialog {
  public constructor() {
    const props: Props = {
      dialogName: 'チャット',
    }
    super(props)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextChatDialogSectionMap {}
