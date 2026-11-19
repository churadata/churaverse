import type { JSXFunc } from 'churaverse-engine-client'
import style from './titleNameFieldComponent.module.scss'

interface TitleNameFieldProps {
  maxLength: number
}

export const TitleNameFieldComponent: JSXFunc<TitleNameFieldProps> = ({ maxLength }) => {
  return (
    <div className={style.container}>
      <div className={style.inputWrapper}>
        <input className={style.textField} type="text" id="title-name-field" placeholder="Enter your name" />
        <div className={style.tooltip}>
          <ul>
            <li>1文字以上{maxLength}文字以下</li>
            <li>連続するスペースは使用不可</li>
          </ul>
        </div>
        <span className={style.count} id="title-name-count">
          0/{maxLength}
        </span>
      </div>
    </div>
  )
}
