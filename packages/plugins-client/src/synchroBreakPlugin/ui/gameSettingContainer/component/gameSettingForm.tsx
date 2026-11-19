import type { JSXFunc } from 'churaverse-engine-client'
import {
  GAME_SETTING_SEND_BUTTON_ID,
  SYNCHRO_BREAK_MAX_TIME_LIMIT,
  SYNCHRO_BREAK_MAX_TURN,
  SYNCHRO_BREAK_MIN_TIME_LIMIT,
  SYNCHRO_BREAK_MIN_TURN,
  TIME_LIMIT_DECREMENT_BUTTON_ID,
  TIME_LIMIT_INCREMENT_BUTTON_ID,
  TIME_LIMIT_INPUT_FIELD_ID,
  TURN_SELECT_DECREASE_BUTTON_ID,
  TURN_SELECT_FIELD_ID,
  TURN_SELECT_INCREASE_BUTTON_ID,
} from '../gameSettingContainer'
import style from './gameSettingForm.module.scss'

export const GameSettingForm: JSXFunc = () => {
  return (
    <div className={style.gameSettingFormContainer}>
      <div className={style.settingRow}>
        <span className={style.label}>ターン数選択</span>
        <div className={style.controller}>
          <button className={style.decrementButton} id={TURN_SELECT_DECREASE_BUTTON_ID}></button>
          <input
            type="number"
            className={style.Input}
            defaultValue={SYNCHRO_BREAK_MIN_TURN}
            min={SYNCHRO_BREAK_MIN_TURN}
            max={SYNCHRO_BREAK_MAX_TURN}
            step={1}
            id={TURN_SELECT_FIELD_ID}
          ></input>
          <button className={style.incrementButton} id={TURN_SELECT_INCREASE_BUTTON_ID}></button>
        </div>
      </div>

      <div className={style.settingRow}>
        <span className={style.label}>制限時間</span>
        <div className={style.controller}>
          <button className={style.decrementButton} id={TIME_LIMIT_DECREMENT_BUTTON_ID} />
          <input
            type="number"
            className={style.Input}
            defaultValue={SYNCHRO_BREAK_MIN_TIME_LIMIT}
            min={SYNCHRO_BREAK_MIN_TIME_LIMIT}
            max={SYNCHRO_BREAK_MAX_TIME_LIMIT}
            step={1}
            id={TIME_LIMIT_INPUT_FIELD_ID}
          ></input>
          <button className={style.incrementButton} id={TIME_LIMIT_INCREMENT_BUTTON_ID} />
        </div>
      </div>

      <button className={style.sendButton} id={GAME_SETTING_SEND_BUTTON_ID}>
        OK
      </button>
    </div>
  )
}
