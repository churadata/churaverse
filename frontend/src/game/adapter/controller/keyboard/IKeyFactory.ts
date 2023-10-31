import { KeyCode } from '../../../domain/model/core/types'
import { IKey } from './IKey'

export interface IKeyFactory {
  createKey: (keyCode: KeyCode, callback: () => void, durationMs: number) => IKey
}
