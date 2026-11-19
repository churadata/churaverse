import type { Scenes } from '../scene/types'
import type { CVEventType } from './events'

/**
 * EventBusが扱う全イベントの親クラス
 */
export abstract class CVEvent<Scene extends Scenes> {
  private _isCanceled = false

  public constructor(
    public readonly type: CVEventType<Scene> & string,
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
