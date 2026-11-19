import { GRID_SIZE, Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import type { AlchemyItemKind } from '../domain/alchemyItemKind'
import type { IAlchemyItemRenderer } from '../domain/IAlchemyItemRenderer'

/**
 * 錬金アイテムのテクスチャキー
 */
const ITEM_TEXTURE_KEY_PREFIX = `alchemyItem`

const DISPLAY_SIZE = 80

/**
 * AlchemyItem描画クラス
 */
export class AlchemyItemRenderer implements IAlchemyItemRenderer {
  private readonly scene: Scene
  private readonly image: Phaser.GameObjects.Image
  private readonly textureKey: string
  private tween?: Phaser.Tweens.Tween

  public constructor(scene: Scene, kind: AlchemyItemKind) {
    this.scene = scene
    this.textureKey = `${ITEM_TEXTURE_KEY_PREFIX}_${kind}`
    this.image = scene.add
      .image(
        // 爆発の初期座標は画面外に設定しておく
        -100,
        -100,
        this.textureKey,
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)
  }

  public static loadAssets(scene: Scene, kind: AlchemyItemKind, imagePath: string): void {
    scene.load.image(`${ITEM_TEXTURE_KEY_PREFIX}_${kind}`, imagePath)
  }

  public chase(dest: Position, speed: number, onUpdate: (pos: Position) => void): void {
    const duration = GRID_SIZE / speed

    this.tween = this.scene.add.tween({
      targets: this.image,

      // X座標の移動を設定
      x: dest.x,

      // Y座標の移動を設定
      y: dest.y,

      // 通信によるラグで歩行距離が伸びた場合は移動速度が上がって調整される
      // 一定以上離れるとteleportで調整する
      duration,

      onUpdate: () => {
        onUpdate(new Position(this.image.x, this.image.y))
      },
    })
  }

  public destroy(): void {
    this.image.destroy()
  }
}
