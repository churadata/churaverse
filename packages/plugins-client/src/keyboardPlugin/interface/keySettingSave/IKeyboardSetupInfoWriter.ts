import type { IMainScene } from 'churaverse-engine-client'
import type { KeyAction } from '../../keyAction/keyAction'

/**
 * キーバインドの情報を保存するためのinterface
 */
export interface IKeyboardSetupInfoWriter {
  save: (keyActions: Array<KeyAction<IMainScene>>) => void
}
