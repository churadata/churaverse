import { FRAME_RATE, layerSetting, Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import tornadoAttackImage from '../assets/tornadoAttack.png'
import type { ITornadoAttackRenderer } from '../domain/ITornadoAttackRenderer'
import { TORNADO_WALK_LIMIT_MS } from '../domain/tornado'

/**
 * 竜巻のテクスチャキー
 */
const TORNADO_ATTACK_TEXTURE_KEY = 'tornadoAttack'

/**
 * 竜巻のアニメーションキー
 */
const TORNADO_ATTACK_ANIM_KEY = 'tornadoAttack'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 200

/**
 * アニメーションの設定配列
 * オブジェクトリテラルに
 */
const _anims: Array<{ key: string; frameStart: number; frameEnd: number }> = [
  { key: 'tornado_attack', frameStart: 0, frameEnd: 2 },
]

/**
 * Tornado描画クラス
 */
export class TornadoAttackRenderer implements ITornadoAttackRenderer {
  private readonly scene: Scene
  private readonly sprite: Phaser.GameObjects.Sprite
  private tween?: Phaser.Tweens.Tween

  public constructor(scene: Scene) {
    this.scene = scene
    this.sprite = scene.add
      .sprite(
        // 竜巻の初期座標は画面外に設定しておく
        -100,
        -100,
        TORNADO_ATTACK_TEXTURE_KEY,
        // アニメーションの番号
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    // アニメーションの設定配列から各アニメーションを生成
    _anims.forEach((cfg) => {
      scene.anims.create({
        key: cfg.key,
        frames: scene.anims.generateFrameNames(TORNADO_ATTACK_ANIM_KEY, {
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
    scene.load.spritesheet(TORNADO_ATTACK_TEXTURE_KEY, tornadoAttackImage, {
      frameWidth: 150,
      frameHeight: 150,
    })
  }

  public walk(position: Position, dest: Position, onUpdate: (pos: Position) => void, onComplete: () => void): void {
    this.sprite.active = true
    const src = position.copy()
    this.tween = this.scene.add.tween({
      // 対象のオブジェクト
      targets: [this.sprite],
      x: {
        getStart: () => src.x,
        getEnd: () => dest.x,
      },
      y: {
        getStart: () => src.y,
        getEnd: () => dest.y,
      },
      // 移動時間
      duration: TORNADO_WALK_LIMIT_MS,

      onUpdate: () => {
        onUpdate(new Position(this.sprite.x, this.sprite.y))
      },

      // 移動終了時に発火するコールバック
      onComplete: () => {
        this.tween?.stop()
        onComplete()
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
