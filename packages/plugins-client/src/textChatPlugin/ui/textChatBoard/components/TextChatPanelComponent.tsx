import dialogStyle from '@churaverse/core-ui-plugin-client/settingDialog/style.module.scss'
import type { JSXFunc } from 'churaverse-engine-client'
import { TextChatInputComponent } from '../../textChatInput/components/TextChatInputComponent'
import { TextChatBoardComponent } from './TextChatBoardComponent'

export const TextChatDialogPanelComponent: JSXFunc = () => {
  return (
    <div className={dialogStyle.container}>
      <div className={dialogStyle.dialogLabel}>チャット</div>
      <TextChatBoardComponent />
      <TextChatInputComponent />
    </div>
  )
}
