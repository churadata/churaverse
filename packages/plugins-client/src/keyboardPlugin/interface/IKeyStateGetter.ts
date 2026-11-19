import type { KeyCode } from '../types/keyCode'

export interface IKeyStateGetter {
  isDown: (keyCode: KeyCode) => boolean
  isJustDown: (keyCode: KeyCode) => boolean
  isUp: (keyCode: KeyCode) => boolean
  isJustUp: (keyCode: KeyCode) => boolean
}
