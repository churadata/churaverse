import type { JSXFunc } from 'churaverse-engine-client'
import style from './ResultCloseButton.module.scss'

/**
 * 結果画面を閉じるボタン
 */
export const ResultCloseButton: JSXFunc = () => {
  return <button className={style.resultCloseButton}>閉じる</button>
}
