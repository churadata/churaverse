import { PlayerPluginError } from './playerPluginError'

export class OwnPlayerUndefinedError extends PlayerPluginError {
  public constructor() {
    super('own playerが存在しません')
  }
}
