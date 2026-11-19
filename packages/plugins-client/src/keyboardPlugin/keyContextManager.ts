import type { IKeyContextManager } from './interface/IKeyContextManager'
import type { KeyContext } from './types/keyContext'

export class KeyContextManager implements IKeyContextManager {
  private _nowContext: KeyContext = 'inGame'

  public setGui(): void {
    this._nowContext = 'gui'
  }

  public setInGame(): void {
    this._nowContext = 'inGame'
  }

  public get nowContext(): KeyContext {
    return this._nowContext
  }
}
