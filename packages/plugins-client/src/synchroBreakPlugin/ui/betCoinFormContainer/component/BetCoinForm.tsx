import type { JSXFunc } from 'churaverse-engine-client'
import {
  BET_COIN_DECREMENT_BUTTON_ID,
  BET_COIN_INCREMENT_BUTTON_ID,
  BET_COIN_INPUT_FIELD_ID,
  BET_COIN_SEND_BUTTON_ID,
  SYNCHRO_BREAK_MAX_BET_COIN,
  SYNCHRO_BREAK_MIN_BET_COIN,
} from '../betCoinFormContainer'
import style from './BetCoinForm.module.scss'

export const BetCoinForm: JSXFunc = () => {
  return (
    <div className={style.betCoinFormContainer}>
      <p>ベットコイン</p>
      <button className={style.decrementButton} id={BET_COIN_DECREMENT_BUTTON_ID} />
      <input
        type="number"
        className={style.betCoinInput}
        defaultValue={SYNCHRO_BREAK_MIN_BET_COIN}
        min={SYNCHRO_BREAK_MIN_BET_COIN}
        max={SYNCHRO_BREAK_MAX_BET_COIN}
        step={1}
        id={BET_COIN_INPUT_FIELD_ID}
      />
      <button className={style.incrementButton} id={BET_COIN_INCREMENT_BUTTON_ID} />
      <button className={style.sendButton} id={BET_COIN_SEND_BUTTON_ID}>
        OK
      </button>
    </div>
  )
}
