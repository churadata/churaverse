import type { JSXFunc } from 'churaverse-engine-client'
import type { TextChat } from '../../../model/textChat'
import style from './TextChatMessageBlockComponent.module.scss'

interface Props {
  textChat: TextChat
  textColor: string
}

/**
 * 1つのメッセージを描画するコンポーネント
 */
export const TextChatMessageBlockComponent: JSXFunc<Props> = ({ textChat, textColor }: Props) => {
  return (
    <div className={style.messageContainer} style={{ color: textColor }}>
      <div className={style.playerName}>{textChat.name}</div>
      <div className={style.message}>{textChat.message}</div>
    </div>
  )
}
