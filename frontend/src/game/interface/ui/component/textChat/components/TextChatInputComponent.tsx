import style from './TextChatInputComponent.module.scss'
import { JSXFunc } from '../../../util/domManager'
import { TEXT_CHAT_INPUT_FIELD_ID, TEXT_CHAT_SEND_BUTTON_ID } from '../textChatInput'

export const TextChatInputComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <input className={style.chatInput} type="text" id={TEXT_CHAT_INPUT_FIELD_ID} />
      <button className={style.sendButton} type="button" id={TEXT_CHAT_SEND_BUTTON_ID}>
        送信
      </button>
    </div>
  )
}
