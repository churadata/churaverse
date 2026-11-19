import type { JSXFunc } from 'churaverse-engine-client'
import { ROW_CONTENT_CONTAINER_CLASS_NAME } from '../playerList'
import style from './PlayerListItemComponent.module.scss'

interface Props {
  playerName: string
}

/**
 * プレイヤー一人分のコンポーネント
 */
export const PlayerListItemComponent: JSXFunc<Props> = ({ playerName }: Props) => {
  return (
    <div className={style.listRow}>
      <div className={style.playerName}>{playerName}</div>
      <div className={`${style.rowContents} ${ROW_CONTENT_CONTAINER_CLASS_NAME}`}></div>
    </div>
  )
}
