import { CVError } from './cvError'

export class SceneUndefinedError extends CVError {
  static {
    SceneUndefinedError.prototype.name = 'SceneUndefinedError'
  }

  public constructor() {
    super(`scene is undefined`)
  }
}
