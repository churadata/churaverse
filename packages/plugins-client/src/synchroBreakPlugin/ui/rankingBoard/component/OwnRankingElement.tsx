import type { JSXFunc } from 'churaverse-engine-client'
import {
  OWN_RANKING_COINS_ID,
  OWN_RANKING_CONTAINER_ID,
  OWN_RANKING_NAME_ID,
  OWN_RANKING_RANK_ID,
  OWN_RANKING_STATUS_ID,
} from '../ownRankingBoard'
import style from './OwnRankingElement.module.scss'

export const OwnRankingElement: JSXFunc = () => {
  return (
    <div id={OWN_RANKING_CONTAINER_ID} className={style.container}>
      <div className={style.myRankingInfo}>
        <div className={style.rankSection}>
          <span className={style.label}>順位:</span>
          <span id={OWN_RANKING_RANK_ID} className={style.rank}>
            -
          </span>
        </div>
        <div className={style.infoSection}>
          <span id={OWN_RANKING_NAME_ID} className={style.name}>
            -
          </span>
          <div className={style.coinStatusSection}>
            <span id={OWN_RANKING_COINS_ID} className={style.coins}>
              -
            </span>
            <span id={OWN_RANKING_STATUS_ID} className={style.status} data-status="yet">
              yet
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
