import type { JSXFunc } from 'churaverse-engine-client'
import { BET_TIMER_CONTAINER_ID, BET_TIMER_ID } from '../betTimer'
import style from './BetTimer.module.scss'

export const BetTimerComponent: JSXFunc = () => {
  return (
    <div className={style.betTimerContainer} id={BET_TIMER_CONTAINER_ID}>
      <div className={style.betTimer} id={BET_TIMER_ID}></div>
    </div>
  )
}
