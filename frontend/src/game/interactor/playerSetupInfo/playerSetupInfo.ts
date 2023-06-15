import { PlayerColorName } from '../../domain/model/types'

/** アプリ終了後も保存または取得するプレイヤー情報の型 */
export interface PlayerSetupInfo {
  name: string | undefined
  color: PlayerColorName | undefined
}

export const PLAYER_SETUP_PROPERTY: { [key in keyof PlayerSetupInfo]: string } = {
  name: 'name',
  color: 'color',
}
