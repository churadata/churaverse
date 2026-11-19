import type { Scenes } from 'churaverse-engine-client'
import type { KeyAction } from '../keyAction/keyAction'
import type { KeyActionType } from '../keyAction/keyActions'

export interface IKeyActionRegister<Scene extends Scenes> {
  /**
   * KeyActionを登録する. 各typeの初期化処理を行うため、type毎に1度だけ実行する.
   */
  registerKeyAction: (keyAction: KeyAction<Scene>) => void

  /**
   * 登録したKeyActionを取得する
   */
  getRegistered: (type: KeyActionType<Scene> & string) => KeyAction<Scene>

  /**
   * 登録した全KeyActionを取得する
   */
  getAllRegistered: () => Array<KeyAction<Scene>>
}
