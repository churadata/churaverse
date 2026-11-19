import type { Scenes } from 'churaverse-engine-client'
import type { KeyActionType } from '../keyAction/keyActions'
import type { KeyCode } from '../types/keyCode'

export interface IKeyActionKeyCodeBinder<Scene extends Scenes> {
  /**
   * KeyActionに紐付くKeyCodeを変更する
   */
  rebindKey: (type: KeyActionType<Scene>, newKeyCode: KeyCode) => void
}
