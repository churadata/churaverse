import { KeyCode } from '../../../domain/model/core/types'

export interface IKeyDetector {
  isPressed: (keyCode: KeyCode) => boolean
}
