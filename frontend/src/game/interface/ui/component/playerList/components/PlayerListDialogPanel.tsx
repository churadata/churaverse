import { JSXFunc } from '../../../util/domManager'
import { PLAYER_LIST_ID, PLAYER_COUNTER_ID } from '../playerList'
import style from './PlayerListDialogPanel.module.scss'
import dialogStyle from '../../settingDialog/style.module.scss'

export const PlayerListDialogPanel: JSXFunc = () => {
  return (
    <div className={dialogStyle.container}>
      <div className={dialogStyle.dialogLabel}>
        参加者一覧
        <div id={PLAYER_COUNTER_ID}></div>
      </div>
      <div id={PLAYER_LIST_ID} className={style.playerList}></div>
    </div>
  )
}
