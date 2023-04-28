import { Scene } from 'phaser'
import { IBombRender } from '../../domain/IRender/IBombRender'
import { FRAME_RATE } from '../animationConfig'
import { layerSetting } from '../../layer'
import { Position } from '../../domain/position'

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
export class BombRender implements IBombRender {
  private readonly scene
  private readonly sprite

  private constructor(scene: Scene) {
    this.scene = scene

    if (!scene.textures.exists(BOMB_TEXTURE_KEY)) {
      scene.load.spritesheet(BOMB_TEXTURE_KEY, 'assets/bomb_large_explosion.png', {
        frameWidth: 64,
        frameHeight: 64,
      })
    }

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
    scene.anims.create({
      key: _anims[0].key,
      frames: scene.anims.generateFrameNames(BOMB_ANIM_KEY, {
        start: _anims[0].frameStart,
        end: _anims[0].frameEnd,
      }),
      frameRate: FRAME_RATE,
      repeat: -1,
    })

    // 爆発のアニメーションを作成
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

    layerSetting(this.sprite, 'Bomb')
  }

  /**
   * classのbuild関数
   * Promise<BombRender>でのreturnできないため
   * @param scene シーン
   * @param pos 設置座標
   * @returns this
   */
  public static async build(scene: Scene): Promise<BombRender> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(BOMB_TEXTURE_KEY)) {
        resolve()
      }
      scene.load.spritesheet(BOMB_TEXTURE_KEY, 'assets/bomb_large_explosion.png', {
        frameWidth: 64,
        frameHeight: 64,
      })

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new BombRender(scene)
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
  }
}
