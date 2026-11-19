import {
  Direction,
  FRAME_RATE,
  GRID_SIZE,
  HpBarRenderer,
  layerSetting,
  Position,
  vectorToName,
} from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import bossImage from '../assets/dragon.png'
import type { IBossRenderer } from '../domain/IBossRenderer'

/**
 * ボスのテクスチャーキー
 */
const BOSS_TEXTURE_KEY = 'churarenBoss'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 200

/**
 * ボスのアニメーションの設定配列
 */
const _anims = new Map<string, { key: string; frameStart: number; frameEnd: number }>([
  [vectorToName(Direction.left), { key: 'boss_go_left', frameStart: 0, frameEnd: 2 }],
  [vectorToName(Direction.right), { key: 'boss_go_right', frameStart: 3, frameEnd: 5 }],
])

/**
 * ボスのフレームレート
 */
const BOSS_FRAME_RATE = FRAME_RATE / 2

/**
 * ボスのHPバーの横幅
 */
const HP_BAR_WIDTH = 150

/**
 * ボスのHPバーの表示位置
 */
const positionToHpBar = { x: 0.5, y: 8 }

/**
 * ボス名の表示位置
 */
const _relativePositionToBossName = { x: 0, y: -100 }

/**
 * Boss描画クラス
 */
export class BossRenderer implements IBossRenderer {
  private readonly scene: Scene
  private readonly sprite: Phaser.GameObjects.Sprite
  public tween?: Phaser.Tweens.Tween
  private readonly hpBar: HpBarRenderer
  private damageTween?: Phaser.Tweens.Tween
  private readonly bossContainer: Phaser.GameObjects.Container
  private readonly bossFrontContainer: Phaser.GameObjects.Container
  private readonly _bossNamePlate: Phaser.GameObjects.Text

  public constructor(scene: Scene, position: Position, hp: number) {
    this.scene = scene
    this.hpBar = new HpBarRenderer(scene, hp, hp, HP_BAR_WIDTH, 8, { x: positionToHpBar.x, y: positionToHpBar.y })
    this.bossContainer = scene.add.container(position.x, position.y)
    this.bossFrontContainer = scene.add.container(position.x, position.y)

    // スプライトを作成し、表示する
    this.sprite = scene.add.sprite(0, 0, BOSS_TEXTURE_KEY).setOrigin(0.5).setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)
    this.bossContainer.add(this.sprite)
    layerSetting(this.bossContainer, 'player')

    // ボス名プレート
    this._bossNamePlate = scene.add
      .text(_relativePositionToBossName.x, _relativePositionToBossName.y, 'Boss')
      .setOrigin(0.5)
      .setStroke('#000', 3)

    // アニメーションの設定配列から各アニメーションを生成
    _anims.forEach((cfg) => {
      scene.anims.create({
        key: cfg.key,
        frames: scene.anims.generateFrameNames(BOSS_TEXTURE_KEY, {
          start: cfg.frameStart,
          end: cfg.frameEnd,
        }),
        frameRate: BOSS_FRAME_RATE,
        repeat: -1,
      })
    })

    this.bossFrontContainer.add(this._bossNamePlate)
    this.hpBar.addContainer(this.bossFrontContainer)
    layerSetting(this.bossFrontContainer, 'abovePlayer')
    this.hpBar.update(hp)
  }

  // テクスチャのロード
  public static loadAssets(scene: Scene): void {
    scene.load.spritesheet(BOSS_TEXTURE_KEY, bossImage, {
      frameWidth: 150,
      frameHeight: 150,
    })
  }

  // スプライトの生成
  public spawn(): void {
    this.sprite.active = true
    this.hpBar.appear()
    this.sprite.alpha = 1
    this.bossContainer.setVisible(true)
    this.bossFrontContainer.setVisible(true)
    // ボスの初期アニメーション
    this.sprite.anims.play('boss_go_left')
  }

  // スプライトの削除
  public destroy(): void {
    this.sprite.destroy()
    this.hpBar.destroy()
    this.bossContainer.destroy()
    this.bossFrontContainer.destroy()
  }

  /**
   * ダメージを受ける処理
   * @param amount ダメージ量
   * @param hp ボスのHP
   */
  public damage(amount: number, hp: number): void {
    // ボスの近くにダメージをランダムに表記させる範囲
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
    this.bossFrontContainer.add(damageText)
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
    this.hpBar.update(hp)
    this.damageTween?.stop() // 処理の途中で新たにダメージを食らった際に処理をリセットする
    this.damageTween = this.scene.add.tween({
      targets: [this.bossContainer],
      duration: 40,
      repeat: 8, // 8回繰り返す
      yoyo: true,
      alpha: { start: 0, to: 1 },
      onComplete: () => {
        this.bossContainer.alpha = 1
      },
      onStop: () => {
        this.bossContainer.alpha = 1
      },
    })
  }

  public walk(
    startPos: Position,
    dest: Position,
    direction: Direction,
    speed: number,
    onUpdate: (pos: Position) => void,
    _onComplete: () => void
  ): void {
    const duration = GRID_SIZE / speed
    this.tween = this.scene.add.tween({
      targets: [this.bossContainer, this.bossFrontContainer],
      x: {
        getStart: () => startPos.x,
        getEnd: () => dest.x,
      },
      y: {
        getStart: () => startPos.y,
        getEnd: () => dest.y,
      },
      // 移動時間
      duration,
      onUpdate: () => {
        onUpdate(new Position(this.bossContainer.x, this.bossContainer.y))
      },
      onComplete: () => {
        this.bossContainer.x = dest.x
        this.bossContainer.y = dest.y
      },
    })

    const animKey = _anims.get(vectorToName(direction))?.key
    if (animKey !== undefined) {
      this.sprite.anims.play(animKey)
    }
  }
}
