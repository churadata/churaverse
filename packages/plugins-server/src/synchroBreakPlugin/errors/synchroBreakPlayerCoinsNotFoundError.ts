import { SynchroBreakPluginError } from './synchroBreakPluginError'

export class SynchroBreakPlayerCoinsNotFoundError extends SynchroBreakPluginError {
  public constructor(playerId: string) {
    super(`playerId: ${playerId}の所持コイン情報が存在しません`)
  }
}
