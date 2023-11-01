import { KeyCode, KeyEvent } from '../../../../../domain/model/core/types'
import { JSXFunc } from '../../../util/domManager'
import {
  KEY_SETTING_CANCEL_BUTTON_ID,
  KEY_SETTING_SAVE_BUTTON_ID,
  KEY_SETTING_TABLE_ROW_ID,
} from '../keySettingPopUpWindow'
import style from './KeySettingPopupWindowComponent.module.scss'

type KeyEventDescription = {
  [ev in KeyEvent]: string
}
const KEY_EVENT_DESCRIPTION: KeyEventDescription = {
  ShotShark: 'サメを発射',
  DropBomb: '爆弾を設置',
  WalkUp: '上に移動',
  WalkDown: '下に移動',
  WalkLeft: '左に移動',
  WalkRight: '右に移動',
  EnterText: 'チャットを送信',
  FocusShareScreen: 'カメラフォーカス対象の切り替え',
}

type EventAndKeyCode = Map<KeyEvent, KeyCode>

interface Props {
  eventAndKeyCode: EventAndKeyCode
}

export const KeySettingPopupWindowComponent: JSXFunc<Props> = ({ eventAndKeyCode }: Props) => {
  return (
    <div className={style.windowContainer}>
      <div className={style.windowLabel}>キーバインド設定</div>

      <table>
        <tbody>
          {Array.from(eventAndKeyCode.entries()).map(([event, keyCode]) => {
            return <TableRow key={event} eventName={event} keyCode={keyCode} />
          })}
        </tbody>
      </table>

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
  eventName: KeyEvent
  keyCode: KeyCode
}

const TableRow: JSXFunc<RowProps> = ({ eventName, keyCode }: RowProps) => {
  return (
    <tr id={KEY_SETTING_TABLE_ROW_ID(eventName)}>
      <td>{KEY_EVENT_DESCRIPTION[eventName]}</td>
      <td>
        <input className={style.keyInput} type="text" readOnly={true} value={keyCode}></input>
      </td>
    </tr>
  )
}
