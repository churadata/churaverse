import type { JSXFunc } from 'churaverse-engine-client'
import { RESULT_CONTAINER_ID, RESULT_LIST_ID } from '../resultScreen'
import style from './ResultRankingListPanel.module.scss'
import resultStyle from './ResultStyle.module.scss'

export const ResultRankingListPanel: JSXFunc = () => {
  return (
    <div className={resultStyle.container} id={RESULT_CONTAINER_ID}>
      <div className={resultStyle.dialogLabel}></div>
      <div id={RESULT_LIST_ID} className={style.playerList}></div>
    </div>
  )
}
