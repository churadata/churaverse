import { layerSetting, type Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import trapAttackImage from '../assets/grassTrap.png'
import type { ITrapAttackRenderer } from '../domain/ITrapAttackRenderer'

/**
 * トラップのテクスチャキー
 */
const TRAP_ATTACK_TEXTURE_KEY = 'trapAttack'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 80

/**
 * トラップの攻撃アニメーション配列
 */
const _anims: Array<{ key: string; frameStart: number; frameEnd: number }> = [
  { key: 'trap_attack', frameStart: 0, frameEnd: 3 },
]

export class TrapAttackRenderer implements ITrapAttackRenderer {
  private readonly scene: Scene
  private readonly sprite: Phaser.GameObjects.Sprite
  private readonly tween?: Phaser.Tweens.Tween

  public constructor(scene: Scene) {
    this.scene = scene
    this.sprite = scene.add
      .sprite(
        // トラップの初期座標は画面外に設定しておく
        -100,
        -100,
        TRAP_ATTACK_TEXTURE_KEY,
        // アニメーションの番号
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    // ぶつかった時のアニメーション
    scene.anims.create({
      key: _anims[0].key,
      frames: scene.anims.generateFrameNames(TRAP_ATTACK_TEXTURE_KEY, {
        start: _anims[0].frameStart,
        end: _anims[0].frameEnd,
      }),
      frameRate: 6,
      repeat: 0,
      hideOnComplete: true,
    })

    layerSetting(this.sprite, 'player', 20)
  }

  // 基本アイテムのテクスチャのロード
  public static loadAssets(scene: Scene): void {
    scene.load.spritesheet(TRAP_ATTACK_TEXTURE_KEY, trapAttackImage, {
      frameWidth: 60,
      frameHeight: 60,
    })
  }

  public spawn(source: Position): void {
    this.sprite.active = true
    source = source.align()
    this.sprite.x = source.x
    this.sprite.y = source.y
    this.sprite.setPosition(source.x, source.y)
    this.sprite.setVisible(true)
  }

  public collide(): void {
    this.sprite.anims.play(_anims[0].key)
    this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.dead()
    })
  }

  public dead(): void {
    this.sprite.setVisible(false)
    this.sprite.destroy()
  }
}
