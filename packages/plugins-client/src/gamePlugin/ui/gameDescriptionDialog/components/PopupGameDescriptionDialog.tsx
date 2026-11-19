import type { JSXFunc } from 'churaverse-engine-client'
import type { GameIds } from '../../../interface/gameIds'
import { GAME_DESCRIPTION_CONTAINER_ID } from '../gameDescriptionDialog'
import { CloseButtonComponent } from './CloseButtonComponent'
import { GameJoinDeclineButtons } from './GameJoinDeclineButtons'
import style from './PopupGameDescriptionDialog.module.scss'

export const PopupGameDescriptionDialog: JSXFunc<any> = ({
  gameId,
  gameName,
}: {
  gameId: GameIds
  gameName: string
}) => {
  return (
    <div className={style.windowContainer}>
      <div className={style.windowLabel}>{gameName}</div>
      <div id={GAME_DESCRIPTION_CONTAINER_ID(gameId)} className={style.detailContainer}>
        {/* ここに ゲームの説明を入れる */}
      </div>
      <GameJoinDeclineButtons gameId={gameId} />
      <CloseButtonComponent gameId={gameId} />
    </div>
  )
}
