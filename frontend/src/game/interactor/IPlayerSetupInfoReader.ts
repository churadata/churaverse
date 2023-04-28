import { PlayerSetupInfo } from '../interface/playerSetupInfo/playerSetupProperty'

/**
 * interactorからプレイヤー情報を読み込むためのinterface
 */
export interface IPlayerSetupInfoReader {
  read: () => PlayerSetupInfo
}
