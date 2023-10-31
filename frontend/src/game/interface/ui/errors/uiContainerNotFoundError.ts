import { UIError } from './uiError'

export class UIContainerNotFoundError extends UIError {
  public constructor() {
    super('id=uiContainerのdivタグが存在しない')
  }
}
