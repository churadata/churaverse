import { FRAME_RATE, layerSetting, type Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import bombImage from '../assets/bomb_large_explosion.png'
import type { IBombRenderer } from '../domain/IBombRenderer'

/**
 * 初期値の爆弾のテクスチャーキー
 */
const BOMB_TEXTURE_KEY = 'bomb'

/**
 * 爆弾のアニメーションキー
 */
const BOMB_ANIM_KEY = 'bomb'

/**
 * 表示時の縦横のサイズ?
 */
const DISPLAY_SIZE = 80

/**
 * アニメーションの設定配列
 * オブジェクトリテラルに
 */
const _anims: Array<{ key: string; frameStart: number; frameEnd: number }> = [
  { key: 'drop_bomb', frameStart: 0, frameEnd: 2 },
  { key: 'explode_bomb', frameStart: 3, frameEnd: 11 },
]

/**
 * Bomb描画クラス
 */
export class BombRenderer implements IBombRenderer {
  private readonly sprite

  public constructor(scene: Scene) {
    this.sprite = scene.add
      .sprite(
        // 爆弾の初期生成位置
        800,
        440,
        BOMB_TEXTURE_KEY,
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    // 爆発前のアニメーションを作成
    if (!scene.anims.exists(_anims[0].key)) {
      scene.anims.create({
        key: _anims[0].key,
        frames: scene.anims.generateFrameNames(BOMB_ANIM_KEY, {
          start: _anims[0].frameStart,
          end: _anims[0].frameEnd,
        }),
        frameRate: FRAME_RATE,
        repeat: -1,
      })
    }

    // 爆発のアニメーションを作成
    if (!scene.anims.exists(_anims[1].key)) {
      scene.anims.create({
        key: _anims[1].key,
        frames: scene.anims.generateFrameNames(BOMB_ANIM_KEY, {
          start: _anims[1].frameStart,
          end: _anims[1].frameEnd,
        }),
        frameRate: FRAME_RATE,
        repeat: 0,
        hideOnComplete: true,
      })
    }

    layerSetting(this.sprite, 'player', 10)
  }

  // テクスチャのロード
  public static loadAssets(scene: Scene): void {
    scene.load.spritesheet(BOMB_TEXTURE_KEY, bombImage, {
      frameWidth: 64,
      frameHeight: 64,
    })
  }

  public drop(source: Position): void {
    this.sprite.active = true
    source = source.align()
    this.sprite.x = source.x
    this.sprite.y = source.y
    // アニメーション開始
    const animKey = _anims[0].key
    if (animKey === undefined) {
      return
    }
    this.sprite?.anims.play(animKey)
  }

  public explode(): void {
    // drop() アニメーションスプライトの削除

    // アニメーション開始
    const animKey = _anims[1].key
    if (animKey === undefined) {
      return
    }
    this.sprite?.anims.play(animKey)
    this.sprite?.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy()
    })
  }

  /**
   * 描画問題時にbombを破棄する
   */
  public destroy(): void {
    this.sprite.destroy()
  }
}
