import { PlayerColorName, PlayerRoleName } from '../../domain/model/types'

/**
 * interactorからプレイヤー情報を保存するためのinterface
 */
export interface IPlayerSetupInfoWriter {
  save: (name: string, color: PlayerColorName, role: PlayerRoleName) => void
}
