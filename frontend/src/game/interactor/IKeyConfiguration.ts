import { KeyCode, KeyEvent } from '../domain/model/core/types'

export interface IKeyConfiguration {
  editKeyPreference: (keyEvent: KeyEvent, key: KeyCode) => void
  getKeyPreference: () => Map<KeyEvent, KeyCode>
  getKeyCode: (keyEvent: KeyEvent) => KeyCode
}
