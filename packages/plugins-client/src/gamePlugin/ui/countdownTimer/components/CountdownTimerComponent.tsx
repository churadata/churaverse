import type { JSXFunc } from 'churaverse-engine-client'
import { COUNTDOWN_TIMER_ID } from '../countdownTimer'
import style from './CountdownTimerComponent.module.scss'

export const CountdownTimerComponent: JSXFunc = () => {
  return (
    <div className={style.countdownContainer}>
      <div className={style.countdownTimer} id={COUNTDOWN_TIMER_ID}></div>
    </div>
  )
}
