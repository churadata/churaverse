import type { JSXFunc } from 'churaverse-engine-client'
import { TEXT_CHAT_INPUT_FIELD_ID, TEXT_CHAT_MAX_LENGTH, TEXT_CHAT_SEND_BUTTON_ID } from '../textChatInput'
import style from './TextChatInputComponent.module.scss'

export const TEXT_CHAT_CHAR_COUNT_ID = 'chat-char-count'

export const TextChatInputComponent: JSXFunc = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <textarea className={style.chatInput} id={TEXT_CHAT_INPUT_FIELD_ID} rows={1} maxLength={TEXT_CHAT_MAX_LENGTH} />
        <button className={style.sendButton} type="button" id={TEXT_CHAT_SEND_BUTTON_ID}>
          送信
        </button>
      </div>
      <div className={style.footer}>
        <div id={TEXT_CHAT_CHAR_COUNT_ID} className={style.charCount}></div>
        <div className={style.note}>Shift ⇧ + Enter ↵ で改行 / Enter ↵ で送信</div>
      </div>
    </div>
  )
}
