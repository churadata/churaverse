import type { JSXFunc } from 'churaverse-engine-client'
import { GAME_SELECTION_LIST_ID } from '../gameSelectionListContainer'
import {
  GAME_DETAIL_BUTTON_ID,
  GAME_LIST_ITEM_ID,
  GAME_NAME_DIV_ID,
  GAME_START_BUTTON_ID,
  type GameSelectionListItemProps,
} from '../gameSelectionListItemRenderer'
import style from './GameListComponent.module.scss'

export const GameSelectionListItem: JSXFunc<GameSelectionListItemProps> = (props: GameSelectionListItemProps) => {
  return (
    <div id={GAME_LIST_ITEM_ID(props.gameId)} className={style.entryRow}>
      <img src={props.imagePath} alt={props.gameId} style={{ width: props.width, height: props.height }} />
      <div id={GAME_NAME_DIV_ID(props.gameId)} className={style.gameName}>
        {props.gameName}
      </div>
      <div className={style.buttonContainer}>
        <button className={style.startButton} type="button" id={GAME_START_BUTTON_ID(props.gameId)}>
          開始
        </button>
        <button className={style.detailButton} type="button" id={GAME_DETAIL_BUTTON_ID(props.gameId)}>
          詳細
        </button>
      </div>
    </div>
  )
}

export const GameSelectionList: JSXFunc = () => {
  return (
    <div id={GAME_SELECTION_LIST_ID} className={style.tableRowContainer}>
      {/* ここに GameSelectionListItem が入る */}
    </div>
  )
}
