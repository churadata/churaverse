import { KeyCode, KeyDownCallback, KeyEvent } from '../../../domain/model/core/types'

export interface IKeyboardHelper {
  bindKey: (keyEvent: KeyEvent, keyCode: KeyCode, callback: KeyDownCallback, durationMs?: number | null) => void
  update: (delta: number) => void
}
