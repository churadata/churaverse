import type { JSXFunc } from 'churaverse-engine-client'
import style from './ResultRankingSeparator.module.scss'

/**
 * ランキングリストのセパレーター
 */
export const ResultRankingSeparator: JSXFunc = () => {
  return (
    <div className={style.separator}>
      <div className={style.dots}>
        <div className={style.dot}></div>
        <div className={style.dot}></div>
        <div className={style.dot}></div>
      </div>
    </div>
  )
}
