import type { IKey } from './interface/IKey'
import type { IKeyFactory } from './interface/IKeyFactory'
import type { IKeyStateGetter } from './interface/IKeyStateGetter'
import { Key } from './key'
import type { KeyCode } from './types/keyCode'

export class KeyFactory implements IKeyFactory {
  public constructor(private readonly keyStateGetter: IKeyStateGetter) {}

  public createKey(keyCode: KeyCode, durationMs: number): IKey {
    return new Key(keyCode, durationMs, this.keyStateGetter)
  }
}
