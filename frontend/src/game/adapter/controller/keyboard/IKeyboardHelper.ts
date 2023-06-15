import { KeyCode, KeyDownCallback } from './types'

export interface IKeyboardHelper {
  bindKey: (keyCode: KeyCode, callback: KeyDownCallback, durationMs?: number | null) => void
  update: (delta: number) => void
}
