import { GRID_SIZE, Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import type { IItemRenderer } from '../domain/IItemRenderer'
import { ITEM_KINDS, type ItemKind, materialItemImage } from '../domain/itemKind'

/**
 * アイテムのテクスチャーキー
 */
const ITEM_TEXTURE_KEY_PREFIX = 'materialItem'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 40

/**
 * Item描画クラス
 */
export class ItemRenderer implements IItemRenderer {
  private readonly scene: Scene
  private readonly image: Phaser.GameObjects.Image
  private tween?: Phaser.Tweens.Tween
  private readonly textureKey: string

  public constructor(scene: Scene, kind: ItemKind) {
    this.scene = scene
    this.textureKey = `${ITEM_TEXTURE_KEY_PREFIX}_${kind}`

    this.image = scene.add
      .image(
        // アイテムの初期生成位置
        800,
        440,
        this.textureKey,
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)
  }

  // 基本アイテムのテクスチャのロード
  public static loadAssets(scene: Scene): void {
    ITEM_KINDS.forEach((kind) => {
      scene.load.image(`${ITEM_TEXTURE_KEY_PREFIX}_${kind}`, materialItemImage[kind])
    })
  }

  public spawn(source: Position): void {
    this.image.active = true
    source = source.align()
    this.image.x = source.x
    this.image.y = source.y
    this.image.setPosition(source.x, source.y)
    this.image.setVisible(true)
  }

  public chase(dest: Position, speed: number, onUpdate: (pos: Position) => void): void {
    const duration = GRID_SIZE / speed

    this.tween = this.scene.add.tween({
      targets: this.image,
      x: dest.x,
      y: dest.y,

      // 通信によるラグで歩行距離が伸びた場合は移動速度が上がって調整される
      // 一定以上離れるとteleportで調整する
      duration,

      onUpdate: () => {
        onUpdate(new Position(this.image.x, this.image.y))
      },
    })
  }

  /**
   * 10秒経ったらitemを破壊する
   */
  public destroy(): void {
    this.image.destroy()
  }
}
