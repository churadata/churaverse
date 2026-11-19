import type { JSXFunc } from 'churaverse-engine-client'
import resultCrownIcons from '../../../assets/result_crown_icons.png'
import { ROW_CONTENT_CONTAINER_CLASS_NAME } from '../resultScreen'

import style from './ResultRankingListItem.module.scss'

interface Props {
  rank: number
  playerName: string
  coinValue: number
}

export interface FrameInfo {
  name: string
  x: number
  y: number
  width: number
  height: number
}

const spriteFrames: FrameInfo[] = [
  { name: '1st', x: 67, y: 45, width: 48, height: 42 },
  { name: '2nd', x: 67, y: 0, width: 48, height: 42 },
  { name: '3rd', x: 0, y: 0, width: 48, height: 42 },
  { name: 'under4th', x: 0, y: 43, width: 48, height: 42 },
] as const

/**
 * プレイヤー一人分のコンポーネント
 */
export const ResultRankingListItem: JSXFunc<Props> = ({ rank, playerName, coinValue }: Props) => {
  let rankColorClass: string
  let rankSuffix: string

  // 順位に応じて色と画像パスを設定
  if (rank === 1) {
    rankColorClass = style.gold
    rankSuffix = 'st'
  } else if (rank === 2) {
    rankColorClass = style.silver
    rankSuffix = 'nd'
  } else if (rank === 3) {
    rankColorClass = style.bronze
    rankSuffix = 'rd'
  } else {
    rankColorClass = style.black
    rankSuffix = 'th'
  }

  const idx = rank <= 3 ? rank - 1 : 3
  const frame = spriteFrames[idx]

  return (
    <div className={`${style.listRow} ${rankColorClass}`}>
      <div className={style.player}>
        <div
          className={style.crownImage}
          style={{
            width: `${frame.width}px`,
            height: `${frame.height}px`,
            // ランクが3位以内の場合のみ背景画像を設定し、それ以外は背景をなくす
            backgroundImage: rank <= 3 ? `url(${resultCrownIcons})` : 'none',
            backgroundPosition: `-${frame.x}px -${frame.y}px`,
          }}
        ></div>
        <div className={style.rank}>{`${rank}${rankSuffix}`}</div>
        <div className={style.playerName}>{playerName}</div>
        <div className={style.coinValue}>{coinValue}</div>
      </div>
      <div className={`${ROW_CONTENT_CONTAINER_CLASS_NAME}`}></div>
    </div>
  )
}
