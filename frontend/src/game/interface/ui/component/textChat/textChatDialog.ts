import { Dialog } from '../dialog/dialog'
import { TextChatSection } from './textChatSection'
import { Props } from '../dialog/components/Panel'

/**
 * テキストチャットに関するUI
 */
export class TextChatDialog extends Dialog<keyof TextChatDialogSectionMap, TextChatSection> {
  private constructor() {
    const props: Props = {
      dialogName: 'チャット',
    }
    super(props)
  }

  public static async build(): Promise<Dialog<keyof TextChatDialogSectionMap, TextChatSection>> {
    return new TextChatDialog()
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextChatDialogSectionMap {}
