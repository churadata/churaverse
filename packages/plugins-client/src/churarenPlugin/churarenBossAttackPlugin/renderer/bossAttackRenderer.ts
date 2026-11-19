import { Direction, FRAME_RATE, layerSetting, Position, vectorToName } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import bossAttackImage from '../assets/fireAttack.png'
import { CHURAREN_BOSS_ATTACK_LIMIT_MS } from '../domain/bossAttack'
import type { IBossAttackRenderer } from '../domain/IBossAttackRenderer'

/**
 * ボスの攻撃テクスチャキー
 */
const CHURAREN_BOSS_ATTACK_TEXTURE_KEY = 'bossAttack'

/**
 * ボスの攻撃アニメーションキー
 */
const CHURAREN_BOSS_ATTACK_ANIM_KEY = 'bossAttack'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 200

/**
 * ボスの攻撃描画クラス
 */
const _anims = new Map<string, { key: string; frameStart: number; frameEnd: number }>([
  [vectorToName(Direction.right), { key: 'bossAttack_go_right', frameStart: 0, frameEnd: 3 }],
  [vectorToName(Direction.left), { key: 'bossAttack_go_left', frameStart: 4, frameEnd: 7 }],
  [vectorToName(Direction.down), { key: 'bossAttack_go_down', frameStart: 8, frameEnd: 11 }],
  [vectorToName(Direction.up), { key: 'bossAttack_go_up', frameStart: 12, frameEnd: 15 }],
])

/**
 * ボスの攻撃描画クラス
 */
export class BossAttackRenderer implements IBossAttackRenderer {
  private readonly scene
  private readonly sprite
  private tween?: Phaser.Tweens.Tween

  public constructor(scene: Scene) {
    this.scene = scene
    this.sprite = scene.add.sprite(0, 0, CHURAREN_BOSS_ATTACK_TEXTURE_KEY).setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)
    // ユニークなアニメーションキーを生成

    // アニメーションの設定配列から各アニメーションを生成
    _anims.forEach((cfg) => {
      if (!scene.anims.exists(cfg.key)) {
        scene.anims.create({
          key: cfg.key,
          frames: scene.anims.generateFrameNames(CHURAREN_BOSS_ATTACK_ANIM_KEY, {
            start: cfg.frameStart,
            end: cfg.frameEnd,
          }),
          frameRate: FRAME_RATE,
          repeat: -1,
        })
      }
    })

    // ボスの攻撃を描画するレイヤーを設定
    layerSetting(this.sprite, 'player', 40)
  }

  public static loadAssets(scene: Scene): void {
    scene.load.spritesheet(CHURAREN_BOSS_ATTACK_TEXTURE_KEY, bossAttackImage, {
      frameWidth: 100,
      frameHeight: 100,
    })
  }

  public ignition(position: Position, dest: Position, direction: Direction, onUpdate: (pos: Position) => void): void {
    this.sprite.active = true
    const src = position.copy()
    this.tween = this.scene.add.tween({
      // 対象のオブジェクト
      targets: [this.sprite],
      // 移動先
      x: {
        getStart: () => src.x,
        getEnd: () => dest.x,
      },
      y: {
        getStart: () => src.y,
        getEnd: () => dest.y,
      },
      // 移動時間
      duration: CHURAREN_BOSS_ATTACK_LIMIT_MS,

      onUpdate: () => {
        onUpdate(new Position(this.sprite.x, this.sprite.y))
      },
      // 移動完了後の処理
      onComplete: () => {
        this.tween?.stop()
        this.sprite.destroy()
      },
    })

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
