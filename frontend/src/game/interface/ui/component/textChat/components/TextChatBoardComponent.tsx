import { JSXFunc } from '../../../util/domManager'
import { TEXT_CHAT_BOARD_CONTAINER_ID } from '../textChatBoard'
import style from './TextChatBoardComponent.module.scss'

export const TextChatBoardComponent: JSXFunc = () => {
  return <div className={style.board} id={TEXT_CHAT_BOARD_CONTAINER_ID}></div>
}
