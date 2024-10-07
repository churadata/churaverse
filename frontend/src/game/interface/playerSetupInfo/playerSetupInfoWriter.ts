import { IPersistStore } from '../../interactor/IPersistStore'
import { PlayerColor } from '../../plugins/playerPlugin/types/playerColor'
import { PlayerRole } from '../../plugins/playerPlugin/types/playerRole'
import { PLAYER_SETUP_PROPERTY } from './playerSetupInfo'
// クッキーにプレイヤー情報を保存するクラス
export class PlayerSetupInfoWriter {
  public constructor(private readonly cookieRepository: IPersistStore) {}

  public save(name: string, color: PlayerColor, role: PlayerRole): void {
    this.cookieRepository.save(PLAYER_SETUP_PROPERTY.name, name)
    this.cookieRepository.save(PLAYER_SETUP_PROPERTY.color, color)
    this.cookieRepository.save(PLAYER_SETUP_PROPERTY.role, role)
  }
}
