import { TransitionPluginError } from './transitionPluginError'

export class TransitionManagerUndefinedError extends TransitionPluginError {
  public constructor() {
    super('transitionManager is undefined')
  }
}
