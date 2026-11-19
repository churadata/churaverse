import { SynchroBreakPluginError } from './synchroBreakPluginError'

export class UnsupportedNyokkiStatusError extends SynchroBreakPluginError {
  public constructor(status: string) {
    super(`ステータス: ${status}はNyokkiStatusに存在しません`)
  }
}
