import { CVError } from './cvError'

export class SceneUndefinedError extends CVError {
  static {
    this.prototype.name = 'SceneUndefinedError'
  }

  public constructor() {
    super(`scene is undefined`)
  }
}
