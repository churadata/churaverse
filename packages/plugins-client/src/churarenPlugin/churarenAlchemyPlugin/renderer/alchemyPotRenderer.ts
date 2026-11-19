import type { Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import alchemyPotImage from '../assets/alchemyPot.png'
import type { IAlchemyPotRenderer } from '../domain/IAlchemyPotRenderer'

/**
 * alchemyPotのテクスチャーキー
 */
const ALCHEMY_POT_TEXTURE_KEY = 'alchemyPot'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 70

/**
 * AlchemyPot描画クラス
 */
export class AlchemyPotRenderer implements IAlchemyPotRenderer {
  private readonly scene: Scene
  private readonly image: Phaser.GameObjects.Image

  public constructor(scene: Scene) {
    this.scene = scene

    this.image = scene.add
      .image(
        // 画面外に配置
        -100,
        -100,
        ALCHEMY_POT_TEXTURE_KEY,
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)
  }

  public static loadAssets(scene: Scene): void {
    scene.load.image(ALCHEMY_POT_TEXTURE_KEY, alchemyPotImage)
  }

  public spawn(source: Position): void {
    this.image.active = true
    this.image.setPosition(source.x, source.y)
    this.image.setVisible(true)
  }

  public destroy(): void {
    this.image.destroy()
  }
}
