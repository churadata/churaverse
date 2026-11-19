import type { JSXFunc } from 'churaverse-engine-client'
import { COUNTDOWN_BAR_PROGRESS_BAR_ID, COUNTDOWN_BAR_PROGRESS_VALUE_ID } from '../countdownBar'
import style from './CountDownBarComponent.module.scss'

export const CountdownBarComponent: JSXFunc = () => {
  return (
    <div className={`${style.progressItem} progress-item`}>
      <svg className={style.svg} viewBox="0 0 100 100">
        <circle className={style.bgCircle} cx="50" cy="50" r="45" />
        <circle
          id={COUNTDOWN_BAR_PROGRESS_BAR_ID}
          className={`${style.progressBar} progress-bar`}
          cx="50"
          cy="50"
          r="45"
        />
      </svg>
      <div id={COUNTDOWN_BAR_PROGRESS_VALUE_ID} className={`${style.progressValue} progress-value`}>
        0
      </div>
    </div>
  )
}
