import { TextFieldObserver } from '../../interface/ui/util/textFieldObserver'
import { KeyEvent } from '../model/core/types'

export interface IKeyboardConfiguration {
  addKeyboardPreference: (keyEvent: KeyEvent, textFieldObserver: TextFieldObserver) => void
}
