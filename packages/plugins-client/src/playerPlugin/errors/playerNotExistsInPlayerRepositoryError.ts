import { PlayerPluginError } from './playerPluginError'

export class PlayerNotExistsInPlayerRepositoryError extends PlayerPluginError {
  public constructor(playerId: string) {
    super(`playerId: ${playerId}はplayerRepository内に存在しない`)
  }
}
