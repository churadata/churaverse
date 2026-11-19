import dialogStyle from '@churaverse/core-ui-plugin-client/settingDialog/style.module.scss'
import type { JSXFunc } from 'churaverse-engine-client'
import { SEND_BUTTON_ID, TEXT_FIELD_ID } from '../renameForm'
import style from './RenameComponent.module.scss'

interface Props {
  readonly defaultName: string
  readonly maxLength: number
}

export const RenameFormComponent: JSXFunc<Props> = ({ defaultName, maxLength }: Props) => {
  return (
    <div className={style.container}>
      <div className={dialogStyle.itemLabel}>プレイヤー名</div>
      <div className={style.inputRow}>
        <div className={style.inputWrapper}>
          <input
            className={style.textField}
            type="text"
            id={TEXT_FIELD_ID}
            placeholder="Enter your name"
            defaultValue={defaultName}
          />
          <div className={style.tooltip}>
            <ul>
              <li>1文字以上{maxLength}文字以下</li>
              <li>連続するスペースは使用不可</li>
            </ul>
          </div>
        </div>
        <span className={style.count} id="rename-count">
          0/{maxLength}
        </span>
        <button className={style.sendButton} id={SEND_BUTTON_ID}>
          OK
        </button>
      </div>
    </div>
  )
}
