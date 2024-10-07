import { PlayerColor } from '../../plugins/playerPlugin/types/playerColor'
import { PlayerRole } from '../../plugins/playerPlugin/types/playerRole'

/** アプリ終了後も保存または取得するプレイヤー情報の型 */
export interface PlayerSetupInfo {
  name: string | undefined
  color: PlayerColor | undefined
  role: PlayerRole | undefined
}

export const PLAYER_SETUP_PROPERTY: { [key in keyof PlayerSetupInfo]: string } = {
  name: 'name',
  color: 'color',
  role: 'role',
}
