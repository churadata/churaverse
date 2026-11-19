import { Scene } from 'phaser'
import { IKey } from '../adapter/controller/keyboard/IKey'
import { KeyCode } from '../domain/model/core/types'
import { KeyCodeRotator } from './keyCodeRotator'
import { AutoModeControlButton } from './autoModeControlButton'
import { AutoControlledKey } from './autoControlledKey'
import { IKeyFactory } from '../adapter/controller/keyboard/IKeyFactory'

/**
 * テストの際はKeyboardHelperクラス内でKeyFactoryの代わりにAutoKeyFactoryクラスのインスタンスを用いる
 * ```
 * private readonly keyFactory: IKeyFactory = new AutoKeyFactory(this.scene)
 * ```
 *
 * ---
 *
 * Rotatorクラスのコンストラクタに操作したいキーの配列とそれが切り替わるまでの秒数を入れる。
 *
 * 例
 * 並行に以下の2つのキー操作を行う
 * 1. →キー、←キー、Aキーを繰り返し押下する. 押下するキーは400ms毎に切り替える
 * 2. Xキーを押下し続ける
 *
 * ```
 * this.keyCodeRotators = [new KeyCodeRotator(['RIGHT', 'LEFT', 'A'], 400),
 *                         new KeyCodeRotator(['X'], 1000)]
 * ```
 *
 * 何もしない場合は処理に紐づいていないキーを指定する
 */
export class AutoKeyFactory implements IKeyFactory {
  private readonly keyCodeRotators: KeyCodeRotator[] = []
  private readonly autoModeControlButton: AutoModeControlButton

  public constructor(private readonly scene: Scene) {
    // prettier-ignore
    this.keyCodeRotators = [
      new KeyCodeRotator(['RIGHT', 'LEFT'], 4800),
      new KeyCodeRotator(['X'], 3200),]
    // prettier-ignore-end
    this.autoModeControlButton = new AutoModeControlButton(scene)
  }

  /**
   * 受け取ったキーコードごとにインスタンスを生成
   */
  public createKey(keyCode: KeyCode, callback: () => void, durationMs: number): IKey {
    return new AutoControlledKey(
      this.scene,
      keyCode,
      callback,
      durationMs,
      this.keyCodeRotators,
      this.autoModeControlButton
    )
  }
}
