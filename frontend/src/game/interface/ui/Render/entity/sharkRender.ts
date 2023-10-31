import { Scene } from 'phaser'
import { FRAME_RATE } from '../../animationConfig'
import { Direction, vectorToName } from '../../../../domain/model/core/direction'
import { ISharkRender } from '../../../../domain/IRender/ISharkRender'
import { SHARK_WALK_LIMIT_MS } from '../../../../domain/model/shark'
import { Position } from '../../../../domain/model/core/position'
import { layerSetting } from '../../util/canvasLayer'

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
  [vectorToName(Direction.down), { key: 'go_down', frameStart: 0, frameEnd: 1 }],
  [vectorToName(Direction.up), { key: 'go_up', frameStart: 6, frameEnd: 7 }],
  [vectorToName(Direction.left), { key: 'go_left', frameStart: 2, frameEnd: 3 }],
  [vectorToName(Direction.right), { key: 'go_right', frameStart: 4, frameEnd: 5 }],
])

/**
 * Shark描画クラス
 */
export class SharkRender implements ISharkRender {
  public scene
  public sprite
  public tween?: Phaser.Tweens.Tween

  private constructor(scene: Scene) {
    this.scene = scene
    this.sprite = scene.add
      .sprite(
        800,
        440,
        SHARK_TEXTURE_KEY,
        // アニメーションの番号
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    _anims.forEach((cfg) => {
      scene.anims.create({
        key: cfg.key,
        frames: scene.anims.generateFrameNames(SHARK_ANIM_KEY, {
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
   * sharkRenderの初期化関数
   * constructorではpromiseで返せないのでbuild関数経由でインスタンス化
   */
  public static async build(scene: Scene): Promise<SharkRender> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(SHARK_TEXTURE_KEY)) {
        resolve()
      }
      scene.load.spritesheet(SHARK_TEXTURE_KEY, 'assets/shark.png', {
        frameWidth: 90,
        frameHeight: 90,
      })

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new SharkRender(scene)
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
