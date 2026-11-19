import { FRAME_RATE, type Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import flamePillarAttackImage from '../assets/flamePillarAttack.png'
import type { IFlamePillarAttackRenderer } from '../domain/IFlamePillarAttackRenderer'

/**
 * テクスチャキー
 */
const FLAME_PILLAR_ATTACK_TEXTURE_KEY = 'flamePillarAttack'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 70

const _anims: Array<{ key: string; frameStart: number; frameEnd: number }> = [
  { key: 'flame__pillar_attack', frameStart: 0, frameEnd: 3 },
]

export class FlamePillarAttackRenderer implements IFlamePillarAttackRenderer {
  private readonly scene: Scene
  private readonly sprite: Phaser.GameObjects.Sprite

  public constructor(scene: Scene) {
    this.scene = scene
    this.sprite = scene.add
      .sprite(-100, -100, FLAME_PILLAR_ATTACK_TEXTURE_KEY, 0)
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    scene.anims.create({
      key: _anims[0].key,
      frames: this.scene.anims.generateFrameNumbers(FLAME_PILLAR_ATTACK_TEXTURE_KEY, {
        start: _anims[0].frameStart,
        end: _anims[0].frameEnd,
      }),
      frameRate: FRAME_RATE,
      repeat: -1, // 繰り返し再生
    })
  }

  // スプライトシートのロード
  public static loadAssets(scene: Scene): void {
    scene.load.spritesheet(FLAME_PILLAR_ATTACK_TEXTURE_KEY, flamePillarAttackImage, {
      frameWidth: 90, // 各フレームの幅
      frameHeight: 90, // 各フレームの高さ
    })
  }

  public spawn(source: Position): void {
    this.sprite.active = true
    source = source.align()
    this.sprite.x = source.x
    this.sprite.y = source.y
    this.sprite.setPosition(source.x, source.y)
    this.sprite.setVisible(true)

    // アニメーションの再生
    this.sprite.anims.play(_anims[0].key)
  }

  public dead(): void {
    this.sprite.setVisible(false)
    this.sprite.destroy()
  }
}
