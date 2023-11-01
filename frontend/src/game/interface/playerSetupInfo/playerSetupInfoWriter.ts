import { PlayerColorName, PlayerRoleName } from '../../domain/model/types'
import { IPersistStore } from '../../interactor/IPersistStore'
import { IPlayerSetupInfoWriter } from '../../interactor/playerSetupInfo/IPlayerSetupInfoWriter'
import { PLAYER_SETUP_PROPERTY } from '../../interactor/playerSetupInfo/playerSetupInfo'
// クッキーにプレイヤー情報を保存するクラス
export class PlayerSetupInfoWriter implements IPlayerSetupInfoWriter {
  public constructor(private readonly cookieRepository: IPersistStore) {}

  public save(name: string, color: PlayerColorName, role: PlayerRoleName): void {
    this.cookieRepository.save(PLAYER_SETUP_PROPERTY.name, name)
    this.cookieRepository.save(PLAYER_SETUP_PROPERTY.color, color)
    this.cookieRepository.save(PLAYER_SETUP_PROPERTY.role, role)
  }
}
