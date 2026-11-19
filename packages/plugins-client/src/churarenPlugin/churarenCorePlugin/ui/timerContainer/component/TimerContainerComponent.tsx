import type { JSXFunc } from 'churaverse-engine-client'
import { GAME_COUNTDOWN_TIMER_ID } from '../timerContainer'
import style from './TimerContainerComponent.module.scss'

export const TimerContainerComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <div className={style.timer} id={GAME_COUNTDOWN_TIMER_ID}></div>
    </div>
  )
}
