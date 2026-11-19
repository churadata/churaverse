import { GRID_SIZE, layerSetting, Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import waterRingAttackImage from '../assets/waterRingAttack.png'
import type { IWaterRingAttackRenderer } from '../domain/IWaterRingAttackRenderer'

/**
 * 水の輪のテクスチャキー
 */
const WATER_RING_ATTACK_TEXTURE_KEY = 'waterRingAttack'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 200

/**
 * アニメーションの設定配列
 * オブジェクトリテラルに
 */
const _anims: Array<{ key: string; frameStart: number; frameEnd: number }> = [
  { key: 'water_ring_attack', frameStart: 0, frameEnd: 3 },
]

export class WaterRingAttackRenderer implements IWaterRingAttackRenderer {
  private readonly scene: Scene
  private readonly sprite: Phaser.GameObjects.Sprite
  private tween?: Phaser.Tweens.Tween
  private readonly textureKey: string

  public constructor(scene: Scene) {
    this.scene = scene
    this.textureKey = `${WATER_RING_ATTACK_TEXTURE_KEY}`

    // スプライトシートからスプライトを作成
    this.sprite = scene.add
      .sprite(
        -100, // 初期のx位置（画面外）
        -100, // 初期のy位置（画面外）
        WATER_RING_ATTACK_TEXTURE_KEY,
        0 // 初期フレーム
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    // アニメーションの設定配列から各アニメーションを生成
    _anims.forEach((cfg) => {
      if (scene.anims.exists(cfg.key)) return
      scene.anims.create({
        key: cfg.key,
        frames: this.scene.anims.generateFrameNumbers(WATER_RING_ATTACK_TEXTURE_KEY, {
          start: cfg.frameStart,
          end: cfg.frameEnd,
        }),
        frameRate: 10, // フレームレートを調整
        repeat: -1, // 無限に繰り返す
      })
    })

    layerSetting(this.sprite, 'player', 20)
  }

  // 基本アイテムのテクスチャのロード
  public static loadAssets(scene: Scene): void {
    // スプライトシートをロード
    scene.load.spritesheet(WATER_RING_ATTACK_TEXTURE_KEY, waterRingAttackImage, {
      frameWidth: 90, // フレームの幅
      frameHeight: 90, // フレームの高さ
    })
  }

  public spawn(source: Position): void {
    this.sprite.active = true
    source = source.align()
    this.sprite.setPosition(source.x, source.y)
    this.sprite.setVisible(true)

    // スプライトが生成されたときにアニメーションを再生
    const animKey = _anims[0].key
    if (animKey !== undefined) {
      this.sprite.anims.play(animKey)
    }
  }

  public chase(dest: Position, speed: number, onUpdate: (pos: Position) => void): void {
    const duration = GRID_SIZE / speed

    this.tween = this.scene.add.tween({
      targets: this.sprite,
      x: dest.x,
      y: dest.y,
      duration,
      onUpdate: () => {
        onUpdate(new Position(this.sprite.x, this.sprite.y))
      },
    })
  }

  public dead(): void {
    this.sprite.setVisible(false)
    this.sprite.destroy()
  }
}
