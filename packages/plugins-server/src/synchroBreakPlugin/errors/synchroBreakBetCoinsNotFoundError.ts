import { SynchroBreakPluginError } from './synchroBreakPluginError'

export class SynchroBreakBetCoinsNotFoundError extends SynchroBreakPluginError {
  public constructor(playerId: string) {
    super(`playerId: ${playerId}のベットコイン情報が存在しません`)
  }
}
