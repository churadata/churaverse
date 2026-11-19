import { GamePluginError } from '@churaverse/game-plugin-server'

export class SynchroBreakPluginError extends GamePluginError {
  public constructor(message: string) {
    super(`[シンクロブレイク] ${message}`)
  }
}
