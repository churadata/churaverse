import dialogStyle from '../../settingDialog/style.module.scss'
import { JSXFunc } from '../../../util/domManager'
import { TextChatBoardComponent } from './TextChatBoardComponent'
import { TextChatInputComponent } from './TextChatInputComponent'

export const TextChatDialogPanelComponent: JSXFunc = () => {
  return (
    <div className={dialogStyle.container}>
      <div className={dialogStyle.dialogLabel}>チャット</div>
      <TextChatBoardComponent />
      <TextChatInputComponent />
    </div>
  )
}
