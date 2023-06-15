import { PlayerSetupInfo } from './playerSetupInfo'

/**
 * interactorからプレイヤー情報を読み込むためのinterface
 */
export interface IPlayerSetupInfoReader {
  read: () => PlayerSetupInfo
}
