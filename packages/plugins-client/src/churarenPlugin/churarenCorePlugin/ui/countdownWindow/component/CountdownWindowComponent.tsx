import type { JSXFunc } from 'churaverse-engine-client'
import { CHURAREN_GAME_START_COUNTDOWN_ID } from '../countdownWindow'
import style from './CountdownWindowComponent.module.scss'

export const CountdownWindowComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <div className={style.timer} id={CHURAREN_GAME_START_COUNTDOWN_ID}></div>
    </div>
  )
}
