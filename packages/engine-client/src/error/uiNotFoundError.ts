import { UIError } from './uiError'

export class UINotFoundError extends UIError {
  public constructor(id: string) {
    super(`id: ${id}の要素が存在しない`)
  }
}
