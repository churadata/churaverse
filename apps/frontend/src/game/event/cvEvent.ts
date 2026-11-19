import { Scenes } from '../scene/types'
import { CVEventType } from './events'

/**
 * EventBusが扱う全イベントの親クラス
 */
export abstract class CVEvent<Scene extends Scenes, EventType extends CVEventType<Scene> = CVEventType<Scene>> {
  private _isCanceled = false

  public constructor(
    public readonly type: EventType,
    /**
     * キャンセル可能なイベントの場合true
     */
    public readonly isCancelable: boolean
  ) {}

  /**
   * このイベントをキャンセルする
   *
   * このメソッドが実行された以降, このイベントに対するcallbackは実行されない.
   *
   * ※同じtypeのイベントを新たにインスタンス化してpostした場合, そのイベントに対するcallbackは実行される.
   */
  public cancel(): void {
    if (!this.isCancelable) {
      throw new Error(`${this.type}はキャンセルできないイベント`)
    }

    this._isCanceled = true
  }

  /**
   * このイベントがキャンセルされているか
   */
  public get isCanceled(): boolean {
    return this._isCanceled
  }
}
