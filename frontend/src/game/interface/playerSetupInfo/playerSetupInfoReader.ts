import { PlayerColorName } from '../../domain/model/types'
import { IPersistStore } from '../../interactor/IPersistStore'
import { IPlayerSetupInfoReader } from '../../interactor/playerSetupInfo/IPlayerSetupInfoReader'
import { PlayerSetupInfo, PLAYER_SETUP_PROPERTY } from '../../interactor/playerSetupInfo/playerSetupInfo'
// プレイヤーの初期情報を取得するクラス
export class PlayerSetupInfoReader implements IPlayerSetupInfoReader {
  public constructor(private readonly cookieRepository: IPersistStore) {}

  public read(): PlayerSetupInfo {
    const info: PlayerSetupInfo = {
      name: this.cookieRepository.read(PLAYER_SETUP_PROPERTY.name),
      color: this.cookieRepository.read(PLAYER_SETUP_PROPERTY.color) as PlayerColorName,
    }
    return info
  }
}
