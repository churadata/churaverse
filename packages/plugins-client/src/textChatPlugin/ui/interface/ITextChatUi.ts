import type { IBadgeHolder, ITopBarIconRenderer } from '@churaverse/core-ui-plugin-client'
import type { IChatInputRenderer } from '../textChatInput/IChatInputRenderer'
import type { IChatBoardRenderer } from './IChatBoardRenderer'
import type { IChatToastRenderer } from './IChatToastRenderer'
import type { ITextChatDialog } from './ITextChatDialog'

export interface ITextChatUi {
  textChatDialog: ITextChatDialog
  textChatBoard: IChatBoardRenderer
  textChatInput: IChatInputRenderer
  textChatIcon: ITopBarIconRenderer & IBadgeHolder
  textChatToast: IChatToastRenderer
}
