import { Scene, Tilemaps } from 'phaser'
import { FRAME_RATE } from '../animationConfig'
import { GRID_SIZE } from '../../domain/worldConfig'
import { Direction, vectorToName } from '../../domain/direction'
import { IPlayerRender } from '../../domain/IRender/IPlayerRender'
import { PLAYER_COLOR_NAMES, PlayerColorName } from '../../domain/model/types'
import { Position } from '../../domain/position'
import { layerSetting } from '../../layer'

/**
 * 初期色の名前 = basic
 */
export const DEFAULT_COLOR_NAME = PLAYER_COLOR_NAMES[0]

/**
 * プレイヤーのテクスチャの色の名前
 */
const TEXTURE_KEYS: { [key in PlayerColorName]: string } = {
  basic: 'basicHero',
  red: 'redHero',
  black: 'blackHero',
  blue: 'blueHero',
  gray: 'grayHero',
}

/**
 * プレイヤーのテクスチャの色とファイル名
 */

const TEXTURE_FILENAMES: { [key in PlayerColorName]: string } = {
  basic: 'assets/playerColor/hero.png',
  red: 'assets/playerColor/hero_red.png',
  black: 'assets/playerColor/hero_black.png',
  blue: 'assets/playerColor/hero_blue.png',
  gray: 'assets/playerColor/hero_gray.png',
}

/**
 * 移動アニメーションの設定配列
 * オブジェクトリテラルに
 */
const _anims = new Map<string, { key: string; frameStart: number; frameEnd: number }>([
  [vectorToName(Direction.up), { key: 'walk_back', frameStart: 11, frameEnd: 9 }],
  [vectorToName(Direction.down), { key: 'walk_front', frameStart: 0, frameEnd: 2 }],
  [vectorToName(Direction.left), { key: 'walk_left', frameStart: 3, frameEnd: 5 }],
  [vectorToName(Direction.right), { key: 'walk_right', frameStart: 6, frameEnd: 8 }],
])

/**
 * PlayerのSpriteから名前プレートの相対座標
 */
const _relativePositionToNamePlate = { x: 0, y: -30 }

/**
 * Player描画クラス
 */
export class PlayerRender implements IPlayerRender {
  private readonly scene
  private sprite
  private tween?: Phaser.Tweens.Tween
  private _playerNamePlateTween?: Phaser.Tweens.Tween
  private color: PlayerColorName

  private readonly _playerNamePlate: Phaser.GameObjects.Text

  private constructor(
    scene: Scene,
    mapLayer: Tilemaps.TilemapLayer,
    position: Position,
    direction: Direction,
    name: string,
    color: PlayerColorName
  ) {
    this.scene = scene
    this.color = color

    this.sprite = scene.add
      .sprite(position.x, position.y, TEXTURE_KEYS[DEFAULT_COLOR_NAME])
      // 縮尺
      .setOrigin(0.5)
      .setDisplaySize(GRID_SIZE, GRID_SIZE)

    this._playerNamePlate = scene.add
      .text(position.x + _relativePositionToNamePlate.x, position.y + _relativePositionToNamePlate.y, name)
      .setOrigin(0.5)
      .setStroke('#403c3c', 3)

    _anims.forEach((cfg) => {
      this.sprite.anims.create({
        key: cfg.key,
        frames: scene.anims.generateFrameNumbers(TEXTURE_KEYS[color], { start: cfg.frameStart, end: cfg.frameEnd }),
        frameRate: FRAME_RATE,
        repeat: -1,
      })
    })

    this.turn(direction)

    layerSetting(this.sprite, 'OwnPlayer')
    layerSetting(this._playerNamePlate, 'PlayerName')
  }

  /**
   * classのbuild関数
   * Promise<PlayerRender>でのreturnできないため
   * @param scene シーン
   * @param mapLayer mapのLayer 衝突用
   * @param pos 初期位置
   * @param name 初期プレイヤー名
   * @param color 初期プレイヤー色
   * @returns this
   */
  public static async build(
    scene: Scene,
    mapLayer: Tilemaps.TilemapLayer,
    pos: Position,
    direction: Direction,
    name: string,
    color: PlayerColorName
  ): Promise<PlayerRender> {
    return await new Promise<void>((resolve, reject) => {
      if (scene.textures.exists(TEXTURE_KEYS[DEFAULT_COLOR_NAME])) {
        resolve()
      }

      PLAYER_COLOR_NAMES.forEach((name: PlayerColorName) =>
        scene.load.spritesheet(TEXTURE_KEYS[name], TEXTURE_FILENAMES[name], {
          frameWidth: 32,
          frameHeight: 32,
        })
      )
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new PlayerRender(scene, mapLayer, pos, direction, name, color)
    })
  }

  /**
   * playerのidをnameにセットしておく
   * @param id playerのid
   */
  public setSpriteId(id: string): void {
    this.sprite.name = id
  }

  /**
   * 姿を現す関数
   */
  public appear(): void {
    this.sprite.alpha = 1
    this._playerNamePlate.alpha = 1
  }

  /**
   * 姿を消す関数
   */
  public disappear(): void {
    this.sprite.alpha = 0
    this._playerNamePlate.alpha = 0
  }

  /**
   * リスポーンを描画する関数
   * @param position リスポーン後の位置
   */
  public respawn(position: Position): void {
    this.teleport(position)
    this.appear()
  }

  /**
   * ゲームから離れる
   */
  public leave(): void {
    this.stop()
    this.disappear()
    this.sprite.destroy()
    this._playerNamePlate.destroy()
  }

  /**
   * 画面の追従を開始する
   */
  public focus(): void {
    this.scene.cameras.main.startFollow(this.sprite)
  }

  public ignore(): void {
    this.scene.cameras.main.stopFollow()
  }

  /**
   * 方向転換
   * @param direction 向き
   * @param color 今の色
   */
  public turn(direction: Direction): void {
    // 方向転換 0は下向き
    this.sprite.setTexture(TEXTURE_KEYS[this.color], _anims.get(vectorToName(direction))?.frameStart ?? 0)
  }

  /**
   * 歩きのアニメーションを設定する関数
   * @param dest 歩いた先の座標
   */
  public walk(
    dest: Position,
    direction: Direction,
    speed: number,
    onUpdate: (pos: Position) => void,
    onComplete: () => void
  ): void {
    const duration = GRID_SIZE / speed

    this.tween = this.scene.add.tween({
      targets: [this.sprite],

      // X座標の移動を設定
      x: dest.x,

      // Y座標の移動を設定
      y: dest.y,

      // 通信によるラグで歩行距離が伸びた場合は移動速度が上がって調整される
      // 一定以上離れるとteleportで調整する
      duration,

      onUpdate: () => {
        onUpdate(new Position(this.sprite.x, this.sprite.y))
      },

      onComplete: () => {
        // tweenの上書きが行われていた場合は実行しない
        if (this.tween?.isPlaying() ?? false) return
        if (this === undefined) return
        this.stopWalk()
        onComplete()
      },
    })

    // playerのネームプレートのアニメーション
    this._playerNamePlateTween = this.scene.add.tween({
      targets: [this._playerNamePlate],
      x: dest.x + _relativePositionToNamePlate.x,
      y: dest.y + _relativePositionToNamePlate.y,
      duration,
    })

    // アニメーション開始
    const animKey = _anims.get(vectorToName(direction))?.key
    if (animKey !== undefined) {
      this.sprite.anims.play(animKey)
    }
  }

  /**
   * 歩行アニメーションを停止する
   */
  private stopWalk(): void {
    // 移動中にleaveした場合animsはundefinedになる
    if (this.sprite.anims === undefined) return

    // tweenをstopすると滑らかなアニメーションにならないためanimsのみpause
    this.sprite.anims.pause()
  }

  /**
   * アニメーション･tweenを止める関数
   */
  public stop(): void {
    this.sprite.anims.stop()
    this.tween?.stop()
    this._playerNamePlateTween?.stop()
  }

  /**
   * テレポートするの関数
   * warpは名前として間違いのため名前変更
   * @param position テレポート先座標
   */
  public teleport(position: Position): void {
    // 動きを止めてる
    this.stop()

    this.sprite.setPosition(position.x, position.y)
    this._playerNamePlate.setPosition(
      position.x + _relativePositionToNamePlate.x,
      position.y + _relativePositionToNamePlate.y
    )
  }

  /**
   * 死んだときのアニメーション
   */
  public dead(): void {
    this.stop()
    this.disappear()
  }

  /**
   * ダメージを受けたときのアニメーション
   * @param amount 受けたダメージ数
   */
  public damage(amount: number): void {
    // プレイヤー近くにダメージをランダムに表記させる範囲
    const X_MIN = -20
    const X_MAX = 20
    const Y_MIN = 0
    const Y_MAX = 20
    const x = this.sprite.x + Math.random() * (X_MAX - X_MIN) + X_MIN
    const y = this.sprite.y + Math.random() * (Y_MAX - Y_MIN) + Y_MIN
    const MOVE_Y = 30 // damageTextが30ずつ上に上がる
    const DURATION = 300 // ダメージが表示されて消えていく時間
    const THICKNESS = 5 // damageTextの縁の太さ
    const damageText = this.scene.add
      .text(x, y, amount.toString(), { fontSize: '23px' })
      .setOrigin(0.5)
      .setStroke('#505050', THICKNESS)
    layerSetting(damageText, 'Damage')
    const tween = this.scene.add.tween({
      targets: [damageText],
      x,
      y: y - MOVE_Y,
      alpha: 0,
      duration: DURATION, // DURATION時間の間damageTextが30ずつ上に上がる
      // tween完了時に実行される関数
      onComplete: () => {
        tween.stop()
        damageText.destroy()
      },
    })
  }

  /**
   * プレイヤーの色を適用する色
   * @param color プレイヤーに適用する色の名前
   */
  public applyPlayerColor(color: PlayerColorName): void {
    this.removeWalkAnim()
    this.color = color
    this.sprite.setTexture(TEXTURE_KEYS[color], this.sprite.frame.name)

    // アニメーションも適応
    _anims.forEach((cfg) => {
      this.sprite.anims.create({
        key: cfg.key,
        frames: this.scene.anims.generateFrameNumbers(TEXTURE_KEYS[color], {
          start: cfg.frameStart,
          end: cfg.frameEnd,
        }),
        frameRate: FRAME_RATE,
        repeat: -1,
      })
    })
  }

  /**
   * 名前の表示の変更をする関数
   * @param name 変更後の名前
   */
  public applyPlayerName(name: string): void {
    this._playerNamePlate.setText(name).setOrigin(0.5)
  }

  /**
   * spriteを消滅させる関数
   */
  public destroy(): void {
    this.sprite.destroy()
    this._playerNamePlate.destroy()
  }

  /**
   * playerのアニメーションを削除する
   */
  private removeWalkAnim(): void {
    _anims.forEach((cfg) => {
      this.sprite.anims.remove(cfg.key)
    })
  }
}
