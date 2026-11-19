import { FRAME_RATE, layerSetting, Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import explosionAttackImage from '../assets/explosionAttack.png'
import { EXPLOSION_WALK_LIMIT_MS } from '../domain/explosion'
import type { IExplosionAttackRenderer } from '../domain/IExplosionAttackRenderer'

/**
 * 爆発のテクスチャキー
 */
const EXPLOSION_ATTACK_TEXTURE_KEY = 'explosionAttack'

/**
 * 爆発のアニメーションキー
 */
const EXPLOSION_ATTACK_ANIM_KEY = 'explosionAttack'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 200

/**
 * アニメーションの設定配列
 * オブジェクトリテラルに
 */
const _anims: Array<{ key: string; frameStart: number; frameEnd: number }> = [
  { key: 'explosion_attack', frameStart: 6, frameEnd: 11 },
]

/**
 * Explosion描画クラス
 */
export class ExplosionAttackRenderer implements IExplosionAttackRenderer {
  private readonly scene: Scene
  private readonly sprite: Phaser.GameObjects.Sprite
  private tween?: Phaser.Tweens.Tween

  public constructor(scene: Scene) {
    this.scene = scene
    this.sprite = scene.add
      .sprite(
        // 爆発の初期座標は画面外に設定しておく
        -100,
        -100,
        EXPLOSION_ATTACK_TEXTURE_KEY,
        // アニメーションの番号
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    // アニメーションの設定配列から各アニメーションを生成
    _anims.forEach((cfg) => {
      scene.anims.create({
        key: cfg.key,
        frames: scene.anims.generateFrameNames(EXPLOSION_ATTACK_ANIM_KEY, {
          start: cfg.frameStart,
          end: cfg.frameEnd,
        }),
        frameRate: FRAME_RATE,
        repeat: -1,
      })
    })

    layerSetting(this.sprite, 'player', 20)
  }

  /**
   * テクスチャのロード
   */
  public static loadAssets(scene: Scene): void {
    scene.load.spritesheet(EXPLOSION_ATTACK_TEXTURE_KEY, explosionAttackImage, {
      frameWidth: 64,
      frameHeight: 64,
    })
  }

  public walk(position: Position, dest: Position, onUpdate: (pos: Position) => void): void {
    this.sprite.active = true
    const src = position.copy()
    this.tween = this.scene.add.tween({
      // 対象のオブジェクト
      targets: [this.sprite],
      // X座標の移動を設定
      x: {
        getStart: () => src.x,
        getEnd: () => dest.x,
      },
      // Y座標の移動を設定
      y: {
        getStart: () => src.y,
        getEnd: () => dest.y,
      },
      // 移動時間
      duration: EXPLOSION_WALK_LIMIT_MS,

      onUpdate: () => {
        onUpdate(new Position(this.sprite.x, this.sprite.y))
      },

      // 移動終了時に発火するコールバック
      onComplete: () => {
        this.tween?.stop()
        this.sprite.destroy()
      },
    })

    // アニメーション開始
    const animKey = _anims[0].key
    if (animKey !== undefined) {
      this.sprite.anims.play(animKey)
    }
  }

  public dead(): void {
    this.tween?.stop()
    this.sprite.destroy()
  }
}
