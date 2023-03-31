import { Scene } from 'phaser'
import { Socket, BaseReceiveInfo } from '../socket'
import { layerSetting } from '../layer'
import { Direction } from './player'
import { uniqueId } from './util/uniqueId'

interface EmitBombInfo {
  bombId: string
  position: { x: number; y: number }
}

export class Bomb {
  static readonly DROP_FRAME: number = 20
  id: string
  static bombs = new Map<string, Bomb>()

  constructor(scene: Scene, x: number, y: number, direction?: Direction) {
    this.id = uniqueId()
    Bomb.bombs.set(this.id, this)

    this.generateBomb(scene, x, y, direction)
    this.startAnim()
  }

  public sprite?: Phaser.GameObjects.Sprite
  public otherPlayerBomsObjects?: Phaser.GameObjects.Sprite

  /**
   * 爆弾のアニメーション設定
   * @param config Phaserの設定
   * @param frame_rate フレームレート
   */
  public static AnimConfig(
    config: { key: string; frameStart: number; frameEnd: number },
    scene: Scene,
    FRAME_RATE: number
  ): Phaser.Types.Animations.Animation {
    return {
      key: config.key,
      frames: scene.anims.generateFrameNumbers('bomb', {
        start: config.frameStart,
        end: config.frameEnd,
      }),
      frameRate: FRAME_RATE,
      repeat: 0,
      hideOnComplete: true,
    }
  }

  /**
   * 爆弾爆発アニメーションの設定配列
   */
  private static readonly _anims: Array<{
    key: string
    frameStart: number
    frameEnd: number
  }> = [
    { key: 'bomb_explosion', frameStart: 0, frameEnd: 11 },
    // {key: 'bomb_explosion', frameStart: 30, frameEnd: 35},
  ]

  /**
   * 爆弾爆発アニメーションの設定配列を返す
   * @returns _animsを返す
   */
  public static get getAnims(): Array<{
    key: string
    frameStart: number
    frameEnd: number
  }> {
    return this._anims
  }

  public static improvementLocation(
    x: number,
    y: number,
    direction?: Direction
  ): { x: number; y: number } {
    if (direction === 'up' || direction === 'down') {
      y = Math.round(y / 40) * 40
    } else {
      x = Math.round(x / 40) * 40
    }
    return { x, y }
  }

  /**
   * 爆弾を描画
   */
  public generateBomb(
    scene: Scene,
    _x: number,
    _y: number,
    direction?: Direction,
    isOtherPlayerBomb: boolean = false
  ): void {
    const DISPLAY_SIZE = 80
    let position: { x: number; y: number }
    if (!isOtherPlayerBomb) {
      position = Bomb.improvementLocation(_x, _y, direction)
    } else {
      position = { x: _x, y: _y }
    }
    this.sprite = scene.add.sprite(position.x, position.y, 'bomb', 0)
    this.sprite.setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)
    // Bomb画像の深度設定
    layerSetting(this.sprite, 'Bomb')
  }

  /**
   * 爆発のアニメーション再生
   */
  public startAnim(): void {
    if (this.sprite === undefined) {
      console.log('スプライトが設定されていません')
      return
    }
    const sprite = this.sprite
    sprite?.anims.play('bomb_explosion')
    sprite?.on('animationcomplete', () => {
      Bomb.bombs.delete(this.id)
    })
  }

  get info(): EmitBombInfo {
    const bombInfo: EmitBombInfo = {
      bombId: this.id,
      // spriteと座標の情報は現状このまま（要修正）
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      position: { x: this.sprite!.x, y: this.sprite!.y },
    }
    return bombInfo
  }

  /**
   * サーバから受け取った爆弾設置の情報を描画に反映
   */
  private static otherPlayerDropBomb(
    scene: Scene,
    bombInfo: EmitBombInfo & BaseReceiveInfo
  ): Bomb {
    // console.log(bombInfo)
    // console.log('爆弾投下');
    const bomb: Bomb = new Bomb(scene, bombInfo.position.x, bombInfo.position.y)
    return bomb
  }

  public static socketOn(socket: Socket): void {
    socket.on('bomb', Bomb.otherPlayerDropBomb)
  }
}
