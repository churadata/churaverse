import type { JSXFunc } from 'churaverse-engine-client'
import type { KeyCode } from '../../../types/keyCode'
import type { CanSettingKeyActType } from '../canSettingKeyActionType'
import {
  KEY_SETTING_CANCEL_BUTTON_ID,
  KEY_SETTING_SAVE_BUTTON_ID,
  KEY_SETTING_TABLE_ID,
  KEY_SETTING_TABLE_ROW_ID,
} from '../keySettingPopUpWindow'
import style from './KeySettingPopupWindowComponent.module.scss'

export const KeySettingPopupWindowComponent: JSXFunc = () => {
  return (
    <div className={style.windowContainer}>
      <div className={style.windowLabel}>キーバインド設定</div>

      <div id={KEY_SETTING_TABLE_ID} className={style.tableRowContainer}>
        {/* ここに KeySettingTableRowが入る */}
      </div>

      <div className={style.buttonsContainer}>
        <button className={style.cancelButton} id={KEY_SETTING_CANCEL_BUTTON_ID} type="button">
          キャンセル
        </button>
        <button id={KEY_SETTING_SAVE_BUTTON_ID} type="button">
          保存
        </button>
      </div>
    </div>
  )
}

interface RowProps {
  type: CanSettingKeyActType
  keyCode: KeyCode
  description: string
  order: number
}

export const KeySettingTableRow: JSXFunc<RowProps> = ({ type, keyCode, description, order }: RowProps) => {
  return (
    <div id={KEY_SETTING_TABLE_ROW_ID(type)} className={style.tableRow} style={{ order }}>
      <div className={style.keyDescription}>{description}</div>
      <div>
        <input className={style.keyInput} type="text" readOnly={true} value={keyCode}></input>
      </div>
    </div>
  )
}
