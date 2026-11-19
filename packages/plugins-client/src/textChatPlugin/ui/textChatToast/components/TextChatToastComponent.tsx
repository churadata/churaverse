import type { JSXFunc } from 'churaverse-engine-client'
import type { TextChat } from '../../../model/textChat'
import style from './TextChatToastComponent.module.scss'

interface TextChatToastProps {
  textChat: TextChat
}

export const TextChatToastComponent: JSXFunc<TextChatToastProps> = ({ textChat }) => {
  const closeButtonId = `toast-close-${textChat.playerId}`

  return (
    <div className={style.toastContainer}>
      <span className={style.closeButton} id={closeButtonId}>
        ×
      </span>

      <div className={style.senderName}>{textChat.name}</div>
      <div className={style.message}>{textChat.message}</div>
    </div>
  )
}
