import { PlayerPluginError } from './playerPluginError'

export class PlayerRendererNotFoundError extends PlayerPluginError {
  public constructor(playerId: string) {
    super(`playerId: ${playerId}のplayerRendererが存在しない`)
  }
}
