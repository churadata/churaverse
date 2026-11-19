import type { IMainScene, Scenes } from 'churaverse-engine-client'
import type { KeyCode } from '../types/keyCode'
import type { KeyContext } from '../types/keyContext'
import type { KeyActionType } from './keyActions'

export class KeyAction<Scene extends Scenes = IMainScene> {
  private _keyCode: KeyCode

  public constructor(
    /**
     * KeyAction名
     */
    public readonly type: KeyActionType<Scene> & string,

    /**
     * 初期設定のキーバインド
     */
    public readonly defaultKey: KeyCode,

    /**
     * このKeyActionが有効になるコンテキスト
     */
    public readonly keyContext: KeyContext = 'inGame',

    /**
     * 長押し時にlistenerを実行する間隔(ms). 省略すると押されている間update毎にlistenerを実行. Infinityにすると押下した瞬間だけ実行する.
     */
    public readonly interval: number = 0,

    /**
     * falseの場合interval以上長押ししていない場合でも押下した瞬間はlistenerを実行する. trueの場合必ずinterval以上長押ししていた場合に実行する.
     */
    public readonly ignoreJustDown: boolean = false
  ) {
    this._keyCode = defaultKey
  }

  /**
   * 現在このActionに紐付けられているKeyCode. rebind()で変更可能
   */
  public get keyCode(): KeyCode {
    return this._keyCode
  }

  public rebind(_keyCode: KeyCode): void {
    this._keyCode = _keyCode
  }
}
