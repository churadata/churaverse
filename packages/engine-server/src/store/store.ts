import type { IMainScene } from '../scene/IScene/IMainScene'
import type { ITitleScene } from '../scene/IScene/ITitleScene'
import type { Scenes } from '../scene/types'
import type { UtilStoreInMain, UtilStoreInTitle } from './utilStore'

type AddUndefined<T> = { [P in keyof T]: T[P] | undefined }

/**
 * プラグイン間で共有したいデータを保持する
 * 共有データはプラグイン毎にまとめる
 */
export class Store<Scene extends Scenes> {
  private shared: Partial<StoreIn<Scene>> = {}

  /**
   * storeNameで指定したstoreを初期化する
   * @param storeName 初期化したいstoreの名前
   * @param initState 初期状態
   */
  public setInit<Key extends keyof StoreIn<Scene>>(storeName: Key, initState: AddUndefined<StoreIn<Scene>[Key]>): void {
    // 依存関係等の都合でundefinedをセットする必要がある場合を考慮してinitStateはAddUndefined型として受け取る
    this.shared[storeName] = initState as StoreIn<Scene>[Key]
  }

  /**
   * storeNameで指定したstoreを取得する. 取得前にsetInitで初期化している必要がある
   * @param storeName 取得したいstoreの名前
   */
  public of<Key extends keyof StoreIn<Scene> & string>(storeName: Key): StoreIn<Scene>[Key] {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const store: StoreIn<Scene>[Key] = this.shared[storeName]!
    if (store === undefined) {
      throw new Error(`storeName: ${storeName} の値は undefined. 取得前にsetInit()で初期化する必要がある`)
    }
    return store
  }

  /**
   * 指定したstoreを削除する
   * 削除されたstoreの値はundefinedになる
   * @param storeName 削除したいstoreの名前
   */
  public deleteStoreOf<Key extends keyof StoreIn<Scene>>(storeName: Key): void {
    this.shared[storeName] = undefined
  }

  public deleteStore(): void {
    this.shared = {}
  }
}

// 各プラグインで共有データを追加したい場合はStoreInTitle/StoreInMainに対してdeclare moduleを使ってデータの定義を追加する
// データを追加する際はsetInitを使ってデータの初期値を設定する必要がある
export interface StoreInTitle {
  util: UtilStoreInTitle
}
export interface StoreInMain {
  util: UtilStoreInMain
}

export type StoreIn<Scene extends Scenes> = Scene extends ITitleScene
  ? StoreInTitle
  : Scene extends IMainScene
    ? StoreInMain
    : never
