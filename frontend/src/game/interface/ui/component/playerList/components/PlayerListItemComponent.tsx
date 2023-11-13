import { JSXFunc } from '../../../util/domManager'
import style from './PlayerListItemComponent.module.scss'

interface Props {
  playerName: string
  hasPermissionToKick: boolean
  itemId: string
}

/**
 * プレイヤー一人分のコンポーネント
 * @param param0
 * @returns
 */
export const PlayerListItemComponent: JSXFunc<Props> = ({ playerName, hasPermissionToKick, itemId }: Props) => {
  const KICK_ICON_IMAGE_PATH = 'assets/exit.png'

  return (
    <table className={style.tableStyle}>
      <tr>
        <td className={style.playerNameCell}>{playerName}</td>
        {hasPermissionToKick && (
          <td className={style.kickButtonCell}>
            <img id={itemId} src={KICK_ICON_IMAGE_PATH} className={style.kickButton} />
          </td>
        )}
      </tr>
    </table>
  )
}
