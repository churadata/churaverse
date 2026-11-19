import { Direction, FRAME_RATE, layerSetting, Position, type Vector, vectorToName } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import iceArrowAttackImage from '../assets/iceArrowAttack.png'
import type { IIceArrowAttackRenderer } from '../domain/IIceArrowAttackRenderer'
import { ICE_ARROW_WALK_LIMIT_MS } from '../domain/iceArrow'

/**
 * 氷の矢のテクスチャキー
 */
const ICE_ARROW_ATTACK_TEXTURE_KEY = 'iceArrowAttack'

/**
 * 氷の矢のアニメーションキー
 */
const ICE_ARROW_ATTACK_ANIM_KEY = 'iceArrowAttack'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 100 // 表示時の縦横のサイズ

/**
 * アニメーションの設定配列
 * オブジェクトリテラルに
 */
const _anims = new Map<string, { key: string; frameStart: number; frameEnd: number }>([
  [vectorToName(Direction.right), { key: 'ice_arrow_right', frameStart: 0, frameEnd: 3 }],
  [vectorToName(Direction.left), { key: 'ice_arrow_left', frameStart: 4, frameEnd: 7 }],
  [vectorToName(Direction.down), { key: 'ice_arrow_down', frameStart: 8, frameEnd: 11 }],
  [vectorToName(Direction.up), { key: 'ice_arrow_up', frameStart: 12, frameEnd: 15 }],
])

/**
 * IceArrow描画クラス
 */
export class IceArrowAttackRenderer implements IIceArrowAttackRenderer {
  private readonly scene: Scene
  private readonly sprite: Phaser.GameObjects.Sprite
  private tween?: Phaser.Tweens.Tween

  public constructor(scene: Scene) {
    this.scene = scene
    this.sprite = scene.add
      .sprite(
        // 氷の矢の初期座標は画面外に設定しておく
        -100,
        -100,
        ICE_ARROW_ATTACK_TEXTURE_KEY,
        // アニメーションの番号
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    // アニメーションの設定配列から各アニメーションを生成
    _anims.forEach((cfg) => {
      scene.anims.create({
        key: cfg.key,
        frames: scene.anims.generateFrameNames(ICE_ARROW_ATTACK_ANIM_KEY, {
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
    scene.load.spritesheet(ICE_ARROW_ATTACK_TEXTURE_KEY, iceArrowAttackImage, {
      frameWidth: 60,
      frameHeight: 60,
    })
  }

  public walk(
    position: Position,
    dest: Position,
    direction: Direction,
    attackVector: Vector,
    onUpdate: (pos: Position) => void
  ): void {
    this.sprite.active = true
    const src = position.copy()

    // Tweenを設定してスプライトを移動
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
      duration: ICE_ARROW_WALK_LIMIT_MS,

      onUpdate: () => {
        onUpdate(new Position(this.sprite.x, this.sprite.y))
      },

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
    // direction に基づいて回転角度を設定
    if (direction == null || attackVector == null) {
      console.error('direction or attackVector is missing')
      return
    }

    const baseRotation = -Math.atan2(direction.y, direction.x)

    // attackVector に基づいた回転を追加
    const attackRotation = Math.atan2(attackVector.y, attackVector.x)

    // 合計の回転角度を設定
    this.sprite.rotation = baseRotation + attackRotation
  }

  public dead(): void {
    this.tween?.stop()
    this.sprite.destroy()
  }
}
