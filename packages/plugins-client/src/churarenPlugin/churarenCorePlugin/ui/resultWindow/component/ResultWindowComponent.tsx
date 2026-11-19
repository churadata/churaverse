import type { JSXFunc } from 'churaverse-engine-client'
import { CHURAREN_GAME_FINISH_BUTTON_ID, CHURAREN_GAME_RESULT_TEXT_ID } from '../resultWindow'
import style from './ResultWindowComponent.module.scss'

export const GameResultWindowComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <div className={style.textContainer}>
        {/* biome-ignore lint/a11y/useHeadingContent: content is injected dynamically via DOM */}
        <h3 id={CHURAREN_GAME_RESULT_TEXT_ID}></h3>
      </div>
      <div className={style.buttonContainer}>
        <button className={style.button} type="button" id={CHURAREN_GAME_FINISH_BUTTON_ID}>
          終了する
        </button>
      </div>
    </div>
  )
}
