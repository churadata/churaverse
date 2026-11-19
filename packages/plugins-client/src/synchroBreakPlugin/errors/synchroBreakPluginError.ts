import { GamePluginError } from '@churaverse/game-plugin-client'

export class SynchroBreakPluginError extends GamePluginError {
  public constructor(message: string) {
    super(`[シンクロブレイク] ${message}`)
  }
}
