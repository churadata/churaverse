import { PlayerColorName } from '../../domain/model/types'
import { IPersistStore } from '../../interactor/IPersistStore'
import { IPlayerSetupInfoWriter } from '../../interactor/IPlayerSetupInfoWriter'
import { PLAYER_SETUP_PROPERTY } from './playerSetupProperty'
// クッキーにプレイヤー情報を保存するクラス
export class PlayerSetupInfoWriter implements IPlayerSetupInfoWriter {
  public constructor(private readonly CookieRepository: IPersistStore) {}

  public save(name: string, color: PlayerColorName): void {
    this.CookieRepository.save(PLAYER_SETUP_PROPERTY.name, name)
    this.CookieRepository.save(PLAYER_SETUP_PROPERTY.color, color)
  }
}
