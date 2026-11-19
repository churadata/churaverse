import type { Scenes } from 'churaverse-engine-client'
import type { KeyActionType } from '../keyAction/keyActions'

export interface IKeyActionDispatcher<Scene extends Scenes> {
  /**
   * KeyActionを発行する. on()で登録したlistenerが実行される
   */
  dispatch: (type: KeyActionType<Scene> & string) => void
}
