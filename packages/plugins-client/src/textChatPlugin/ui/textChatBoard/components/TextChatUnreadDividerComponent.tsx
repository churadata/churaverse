import type { JSXFunc } from 'churaverse-engine-client'
import style from './TextChatUnreadDividerComponent.module.scss'

export const TextChatUnreadDividerComponent: JSXFunc = () => {
  return (
    <div className={style.dividerContainer}>
      <div className={style.line}></div>
      <span className={style.text}>ここから新着メッセージ</span>
      <div className={style.line}></div>
    </div>
  )
}
