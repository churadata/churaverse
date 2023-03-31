import { Scene } from 'phaser'
import { Direction } from './player'
import { Socket, BaseReceiveInfo } from '../socket'
import { layerSetting } from '../layer'

interface EmitSharkInfo {
  sharkId: string
  startPos: { x: number; y: number; direction: Direction }
}

interface ReceivedDeleteInfo {
  sharkId: string
}

export class Shark {
  static SHOT_FRAME: number = 30
  static sharks = new Map<string, Shark>()
  static readonly DAMAGE = 20
  direction: Direction
  id: string
  startPos!: { x: number; y: number; direction: Direction }

  constructor(
    scene: Scene,
    sharkId: string,
    x: number,
    y: number,
    direction: Direction,
    isOtherPlayerShark: boolean = false
  ) {
    this.direction = direction
    this.id = sharkId
    Shark.sharks.set(this.id, this)

    this.generateShark(scene, isOtherPlayerShark, x, y, direction)
    this.moveStraight(scene, this.id, direction)
  }

  public sprite?: Phaser.GameObjects.Sprite

  /**
   * サメを出現させる
   */
  public generateShark(
    scene: Scene,
    isOtherPlayerShark: boolean,
    x: number,
    y: number,
    direction?: Direction
  ): void {
    if (direction === '') {
      console.log('引数directionが空文字')
      return
    }

    const DISPLAY_SIZE = 100
    const GAP = 65
    let APPER_GAP_X = 0
    let APPER_GAP_Y = 0
    let SPRITE_NUM = 0
    if (!isOtherPlayerShark) {
      // 出現位置をプレイヤーの前方にずらす
      switch (direction) {
        case 'down':
          SPRITE_NUM = 0
          APPER_GAP_Y = GAP
          break
        case 'left':
          SPRITE_NUM = 2
          APPER_GAP_X = -GAP
          break
        case 'right':
          SPRITE_NUM = 4
          APPER_GAP_X = GAP
          break
        case 'up':
          SPRITE_NUM = 6
          APPER_GAP_Y = -GAP
          break
      }
    }

    this.sprite = scene.add.sprite(
      x + APPER_GAP_X,
      y + APPER_GAP_Y,
      'shark',
      SPRITE_NUM
    )
    this.startPos = {
      x: this.sprite.x,
      y: this.sprite.y,
      direction: this.direction,
    }
    // Shark画像のの深度設定
    layerSetting(this.sprite, 'Shark')
    this.sprite.setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)
  }

  /**
   * 発射されたサメが直進するアニメーション
   * @param direction サメの進む向き。省略するとインスタンスのdirectionに設定されている方向に進む。
   */
  public moveStraight(
    scene: Scene,
    id: string,
    direction: Direction = ''
  ): void {
    direction ||= this.direction // directionが空文字の時にthis.directionを設定

    let dx = 0
    let dy = 0
    const DURATION = 1600
    const DISTANCE = 1000

    if (this.sprite === undefined) {
      console.log('スプライトが設定されていません')
      return
    }

    switch (direction) {
      case 'up':
        dy = -1
        break
      case 'down':
        dy = 1
        break
      case 'right':
        dx = 1
        break
      case 'left':
        dx = -1
        break
      default:
        break
    }

    const sprite = this.sprite
    const tween: Phaser.Tweens.Tween = scene.add.tween({
      // 対象のオブジェクト
      targets: [sprite],
      // X座標の移動を設定
      x: {
        getStart: () => sprite.x,
        getEnd: () => sprite.x + DISTANCE * dx,
      },
      // Y座標の移動を設定
      y: {
        getStart: () => sprite.y,
        getEnd: () => sprite.y + DISTANCE * dy,
      },
      // アニメーションの時間
      duration: DURATION,
      // アニメーション終了時に発火するコールバック
      onComplete: () => {
        tween.stop() // Tweenオブジェクトの削除
        sprite.destroy()
        Shark.sharks.delete(id)
      },
    })
    sprite.anims.play(`go_${direction}`)
  }

  public static deleteShark(sharkId: string): void {
    const shark = Shark.sharks.get(sharkId)
    if (shark !== undefined) {
      shark.sprite?.destroy()
    }
    Shark.sharks.delete(sharkId)
  }

  /**
   * サメのアニメーション設定
   * @param config Phaserの設定
   * @param scene コンテキストを参照
   * @param frame_rate フレームレート
   */
  public static AnimConfig(
    config: { key: string; frameStart: number; frameEnd: number },
    scene: Scene,
    FRAME_RATE: number
  ): Phaser.Types.Animations.Animation {
    return {
      key: config.key,
      frames: scene.anims.generateFrameNumbers(`shark`, {
        start: config.frameStart,
        end: config.frameEnd,
      }),
      frameRate: FRAME_RATE,
      repeat: -1,
    }
  }

  /**
   * アニメーションの設定配列
   */
  private static readonly _anims: Array<{
    key: string
    frameStart: number
    frameEnd: number
  }> = [
    { key: 'go_down', frameStart: 0, frameEnd: 1 },
    { key: 'go_left', frameStart: 2, frameEnd: 3 },
    { key: 'go_right', frameStart: 4, frameEnd: 5 },
    { key: 'go_up', frameStart: 6, frameEnd: 7 },
  ]

  /**
   * アニメーションの設定配列を返す
   * @returns _animsを返す
   */
  public static get getAnims(): Array<{
    key: string
    frameStart: number
    frameEnd: number
  }> {
    return this._anims
  }

  get info(): EmitSharkInfo {
    const sharkInfo: EmitSharkInfo = {
      sharkId: this.id,
      startPos: this.startPos,
    }
    return sharkInfo
  }

  /**
   * サーバから受け取ったサメ発射時の情報を描画に反映
   */
  private static otherPlayerShotShark(
    scene: Scene,
    sharkInfo: EmitSharkInfo & BaseReceiveInfo
  ): Shark {
    const shark: Shark = new Shark(
      scene,
      sharkInfo.sharkId,
      sharkInfo.startPos.x,
      sharkInfo.startPos.y,
      sharkInfo.startPos.direction,
      true
    )
    return shark
  }

  private static hitShark(scene: Scene, deleteInfo: ReceivedDeleteInfo): void {
    Shark.deleteShark(deleteInfo.sharkId)
  }

  public static socketOn(socket: Socket): void {
    socket.on('shark', Shark.otherPlayerShotShark)
    socket.on('hitShark', Shark.hitShark)
  }
}
