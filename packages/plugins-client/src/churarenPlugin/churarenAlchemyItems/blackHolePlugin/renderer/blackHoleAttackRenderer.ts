import { FRAME_RATE, layerSetting, Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import blackHoleAttackImage from '../assets/blackHoleAttack.png'
import { BLACK_HOLE_MOVE_LIMIT_MS } from '../domain/blackHole'
import type { IBlackHoleAttackRenderer } from '../domain/IBlackHoleAttackRenderer'

/**
 * ブラックホールアタックのテクスチャキー
 */
const BLACK_HOLE_ATTACK_TEXTURE_KEY = 'blackHoleAttack'

/**
 * ブラックホールアタックのアニメーションキー
 */
const BLACK_HOLE_ATTACK_ANIM_KEY = 'blackHoleAttack'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 150

const _anims: Array<{ key: string; frameStart: number; frameEnd: number }> = [
  { key: 'black_hole_attack', frameStart: 0, frameEnd: 4 },
]

/**
 * ブラックホールアタックの描画クラス
 */
export class BlackHoleAttackRenderer implements IBlackHoleAttackRenderer {
  private readonly scene: Scene
  private readonly sprite: Phaser.GameObjects.Sprite
  private tween?: Phaser.Tweens.Tween

  public constructor(scene: Scene) {
    this.scene = scene
    this.sprite = scene.add
      .sprite(
        // 初期座標は画面外に設定しておく
        -100,
        -100,
        BLACK_HOLE_ATTACK_TEXTURE_KEY,
        // アニメーションの番号
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    scene.anims.create({
      key: _anims[0].key,
      frames: scene.anims.generateFrameNames(BLACK_HOLE_ATTACK_ANIM_KEY, {
        start: _anims[0].frameStart,
        end: _anims[0].frameEnd,
      }),
      frameRate: FRAME_RATE,
      repeat: -1,
    })

    layerSetting(this.sprite, 'player', 20)
  }

  // 基本アイテムのテクスチャのロード
  public static loadAssets(scene: Scene): void {
    scene.load.spritesheet(BLACK_HOLE_ATTACK_TEXTURE_KEY, blackHoleAttackImage, {
      frameWidth: 150,
      frameHeight: 150,
    })
  }

  public move(pos: Position, dest: Position, onUpdate: (pos: Position) => void): void {
    this.sprite.active = true
    const src = pos.copy()
    this.tween = this.scene.add.tween({
      targets: [this.sprite],
      x: {
        getStart: () => src.x,
        getEnd: () => dest.x,
      },
      y: {
        getStart: () => src.y,
        getEnd: () => dest.y,
      },
      duration: BLACK_HOLE_MOVE_LIMIT_MS,
      onUpdate: () => {
        onUpdate(new Position(this.sprite.x, this.sprite.y))
      },
      onComplete: () => {
        this.tween?.stop()
        this.sprite.destroy()
      },
      repeat: -1,
      ease: 'Linear',
      yoyo: true,
    })

    // アニメーション開始
    const animKey = _anims[0].key
    if (animKey !== undefined) {
      this.sprite.anims.play(animKey)
    }
  }

  public dead(): void {
    this.sprite.setVisible(false)
    this.sprite.destroy()
  }
}
