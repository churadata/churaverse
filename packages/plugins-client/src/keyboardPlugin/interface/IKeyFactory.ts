import type { KeyCode } from 'churaverse-engine-client'
import type { IKey } from './IKey'

export interface IKeyFactory {
  createKey: (keyCode: KeyCode, durationMs: number) => IKey
}
