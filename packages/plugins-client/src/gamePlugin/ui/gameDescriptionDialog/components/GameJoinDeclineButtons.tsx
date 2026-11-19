import type { JSXFunc } from 'churaverse-engine-client'
import type { GameIds } from '../../../interface/gameIds'
import { GAME_DECLINE_BUTTON_ID, GAME_JOIN_BUTTON_ID, GAME_JOIN_DECLINE_CONTAINER_ID } from '../gameDescriptionDialog'
import style from './GameJoinDeclineButtons.module.scss'

export const GameJoinDeclineButtons: JSXFunc<any> = ({ gameId }: { gameId: GameIds }) => {
  return (
    <div className={style.buttonsContainer} id={GAME_JOIN_DECLINE_CONTAINER_ID(gameId)}>
      <button className={style.joinButton} id={GAME_JOIN_BUTTON_ID(gameId)} type="button">
        参加する
      </button>
      <button className={style.leaveButton} id={GAME_DECLINE_BUTTON_ID(gameId)} type="button">
        参加しない
      </button>
    </div>
  )
}
