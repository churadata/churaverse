import { Direction, FRAME_RATE, layerSetting, Position, vectorToName } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import sharkImage from '../assets/shark.png'
import type { ISharkRenderer } from '../domain/ISharkRenderer'
import { SHARK_WALK_LIMIT_MS } from '../domain/shark'

/**
 * サメのテクスチャキー
 */
const SHARK_TEXTURE_KEY = 'shark'

/**
 * サメのアニメーションキー
 */
const SHARK_ANIM_KEY = 'shark'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 100

/**
 * アニメーションの設定配列
 * オブジェクトリテラルに
 */
const _anims = new Map<string, { key: string; frameStart: number; frameEnd: number }>([
  [vectorToName(Direction.down), { key: 'shark_go_down', frameStart: 0, frameEnd: 1 }],
  [vectorToName(Direction.up), { key: 'shark_go_up', frameStart: 6, frameEnd: 7 }],
  [vectorToName(Direction.left), { key: 'shark_go_left', frameStart: 2, frameEnd: 3 }],
  [vectorToName(Direction.right), { key: 'shark_go_right', frameStart: 4, frameEnd: 5 }],
])

/**
 * Shark描画クラス
 */
export class SharkRenderer implements ISharkRenderer {
  public scene
  public sprite
  public tween?: Phaser.Tweens.Tween

  public constructor(scene: Scene) {
    this.scene = scene
    this.sprite = scene.add
      .sprite(
        // サメの初期座標は画面外に設定しておく
        -100,
        -100,
        SHARK_TEXTURE_KEY,
        // アニメーションの番号
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    // アニメーションの設定配列から各アニメーションを生成
    _anims.forEach((cfg) => {
      if (!scene.anims.exists(cfg.key)) {
        scene.anims.create({
          key: cfg.key,
          frames: scene.anims.generateFrameNames(SHARK_ANIM_KEY, {
            start: cfg.frameStart,
            end: cfg.frameEnd,
          }),
          frameRate: FRAME_RATE,
          repeat: -1,
        })
      }
    })

    layerSetting(this.sprite, 'player', 20)
  }

  /**
   * テクスチャのロード
   */
  public static loadAssets(scene: Scene): void {
    scene.load.spritesheet(SHARK_TEXTURE_KEY, sharkImage, {
      frameWidth: 90,
      frameHeight: 90,
    })
  }

  public setSpriteId(id: string): void {
    this.sprite.name = id
  }

  public walk(position: Position, dest: Position, direction: Direction, onUpdate: (pos: Position) => void): void {
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
      duration: SHARK_WALK_LIMIT_MS,

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
    const animKey = _anims.get(vectorToName(direction))?.key
    if (animKey !== undefined) {
      this.sprite.anims.play(animKey)
    }
  }

  public dead(): void {
    this.tween?.stop()
    this.sprite.destroy()
  }
}
