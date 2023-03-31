import { Scene } from 'phaser'
import { layerSetting } from '../layer'
import { Socket } from '../socket'
export const WalkAnimStateAry = [
  'walk_front',
  'walk_back',
  'walk_left',
  'walk_right',
  '',
] as const
export type WalkAnimState = typeof WalkAnimStateAry[number]
export type Direction = 'up' | 'down' | 'left' | 'right' | '' // プレイヤーの向き
export type MoveDir = -1 | 0 | 1

export interface PlayerInfo {
  x: number
  y: number
  direction: Direction
  playerId: string
  animState: string
  heroWalkSpeed: number
  heroIsWalking: boolean
  heroColor: string
  heroName: string
}

export interface ReceivedDieInfo {
  id: string
}
export interface ReceivedRespawnInfo {
  id: string
  respawnPos: { x: number; y: number; direction: Direction }
}

export interface ReceivedDamageInfo {
  attacker: string
  target: string
  cause: string
  damage: number
}

export class Player {
  static allPlayers = new Map<string, Player>()

  /**
   * プレイヤーのスプライト
   */
  public id?: string
  public hero?: Phaser.GameObjects.Sprite
  public animState?: WalkAnimState
  private readonly _walkSpeed: number = 40 / 320 // 40px/320ms
  public direction: Direction = 'down'
  private hp: number = 100
  public isDead: boolean = false
  private tween?: Phaser.Tweens.Tween

  /**
   * プレイヤーの名前表示情報
   */
  public playerName: string = 'hero'
  public playerNameArea!: Phaser.GameObjects.Text
  private nameTween?: Phaser.Tweens.Tween

  /**
   * プレイヤーのキャラの色情報
   */

  public playerColor: string = 'basic'

  public isWalking: boolean = false

  /**
   * プレイヤーの速度を返す関数
   * @returns プレイヤーの速度
   */
  public get getWalkSpeed(): number {
    return this._walkSpeed
  }

  /**
   * プレイヤー名の位置を調整する定数オブジェクト
   */
  private readonly adjustPosition = { x: 0, y: -30 }

  /**
   * プレイヤー名の位置を調整する定数オブジェクトを返す
   * @returns adjustPositionを返す
   */
  public get returnAdjustPosition(): {
    x: number
    y: number
  } {
    return this.adjustPosition
  }

  /**
   * 自分のキャラのアニメーション設定
   * @param config Phaserの設定
   * @param scene コンテキストを参照
   * @param frame_rate フレームレート
   */
  public AnimConfig(
    config: { key: string; frameStart: number; frameEnd: number },
    scene: Scene,
    FRAME_RATE: number,
    color: string
  ): Phaser.Types.Animations.Animation {
    return {
      key: config.key,
      frames: scene.anims.generateFrameNumbers(color, {
        start: config.frameStart,
        end: config.frameEnd,
      }),
      frameRate: FRAME_RATE,
      repeat: -1,
    }
  }

  /**
   * 移動アニメーションの設定配列
   */
  private readonly _anims: Array<{
    key: string
    frameStart: number
    frameEnd: number
  }> = [
    { key: 'walk_front', frameStart: 0, frameEnd: 2 },
    { key: 'walk_back', frameStart: 9, frameEnd: 11 },
    { key: 'walk_left', frameStart: 3, frameEnd: 5 },
    { key: 'walk_right', frameStart: 6, frameEnd: 8 },
  ]

  public decreaseHp(scene: Scene, damage: number): void {
    if (damage < 0) {
      console.log('damageが0未満')
    }

    this.hp -= damage
    this.appearDamage(scene, damage)
  }

  public appearDamage(scene: Scene, damage: number): void {
    const X_MIN = -20
    const X_MAX = 20
    const Y_MIN = 0
    const Y_MAX = 20
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const x = this.hero!.x + Math.random() * (X_MAX - X_MIN) + X_MIN
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const y = this.hero!.y + Math.random() * (Y_MAX - Y_MIN) + Y_MIN

    const MOVE_Y = 30
    const DURATION = 300

    const damageText = scene.add
      .text(x, y, damage.toString(), { fontSize: '23px' })
      .setOrigin(0.5)
      .setStroke('#505050', 2)
    layerSetting(damageText, 'Damage')
    const tween = scene.add.tween({
      targets: [damageText],
      x,
      y: y - MOVE_Y,
      alpha: 0,
      duration: DURATION,
      onComplete: () => {
        tween.stop()
        damageText.destroy()
      },
    })
  }

  /**
   * 移動アニメーションの設定配列を返す
   * @returns _animsを返す
   */
  public get getAnims(): Array<{
    key: string
    frameStart: number
    frameEnd: number
  }> {
    return this._anims
  }

  public turn(direction: Direction): void {
    // this.hero?.anims.stop()
    this.direction = direction
    let textureNum = 0
    switch (direction) {
      case 'down':
        textureNum = 0
        break
      case 'up':
        textureNum = 9
        break
      case 'right':
        textureNum = 6
        break
      case 'left':
        textureNum = 3
        break
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.hero!.setTexture(`${this.playerColor}Hero`, textureNum)
  }

  public warp(x: number, y: number, direction?: Direction): void {
    if (this.tween !== undefined) this.tween.stop()
    if (this.nameTween !== undefined) this.nameTween.stop()
    this.hero?.anims.stop()
    this.tween = undefined
    this.nameTween = undefined
    this.isWalking = false

    direction ??= this.direction
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.hero!.x = x
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.hero!.y = y
    this.turn(direction)

    this.playerNameArea.x = x + this.returnAdjustPosition.x
    this.playerNameArea.y = y + this.returnAdjustPosition.y
  }

  public die(): void {
    this.isDead = true
    if (this.hero === undefined) {
      console.log('スプライトが設定されていません')
      return
    }
    this.hero.alpha = 0
    this.playerNameArea.alpha = 0
  }

  public revive(): void {
    this.isDead = false
    if (this.hero === undefined) {
      console.log('スプライトが設定されていません')
      return
    }
    this.hero.alpha = 1
    this.playerNameArea.alpha = 1
  }

  /**
   * グリッドウォークを実装するアニメーション
   */
  public gridWalkTween(
    scene: Scene,
    target: Player,
    baseSpeed: number,
    animState: WalkAnimState,
    onComplete: () => void,
    startPos?: { x: number; y: number; direction: Direction }
  ): void {
    const hero = target.hero
    if (hero === undefined) return

    const DURATION = 40 / baseSpeed
    const GRID_SIZE = 40

    startPos ??= { x: hero.x, y: hero.y, direction: this.direction }

    let dx = 0
    let dy = 0
    switch (animState) {
      case 'walk_back':
        dy = -1
        break
      case 'walk_front':
        dy = 1
        break
      case 'walk_right':
        dx = 1
        break
      case 'walk_left':
        dx = -1
        break
      case '':
        target.animState = animState
        hero.x = startPos.x
        hero.y = startPos.y
        this.playerNameArea.x = startPos.x + this.adjustPosition.x
        this.playerNameArea.y = startPos.y + this.adjustPosition.y
        hero.anims.stop()
        this.isWalking = false
        return
    }

    if (target.animState !== animState) {
      target.hero?.anims.play(animState)
      target.animState = animState
    }

    const correctedStartPos = { x: startPos.x, y: startPos.y }
    // ズレが小さい場合は補正せず現在位置から移動開始
    const IGNORE_DISTANCE = 40
    if (dx !== 0 && Math.abs(startPos.x - hero.x) <= IGNORE_DISTANCE) {
      correctedStartPos.x = hero.x
    } else if (dy !== 0 && Math.abs(startPos.y - hero.y) <= IGNORE_DISTANCE) {
      correctedStartPos.y = hero.y
    }

    const tween = scene.add.tween({
      // 対象のオブジェクト
      targets: [hero],
      // X座標の移動を設定
      x: {
        getStart: () => correctedStartPos.x,
        // Phaserの仕様上、オプショナルが必要なため、こちらの警告は無効にします
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        getEnd: () => startPos!.x + GRID_SIZE * dx,
      },
      // X座標の移動を設定
      y: {
        getStart: () => correctedStartPos.y,
        // Phaserの仕様上、オプショナルが必要なため、こちらの警告は無効にします
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        getEnd: () => startPos!.y + GRID_SIZE * dy,
      },
      // アニメーションの時間
      duration: DURATION,
      // アニメーション終了時に発火するコールバック
      onComplete: () => {
        tween.stop() // Tweenオブジェクトの削除
        onComplete() // 引数の関数実行
      },
    })
    this.tween = tween

    const nameTween = scene.add.tween({
      // 対象のオブジェクト
      targets: [target.playerNameArea],
      // X座標の移動を設定
      x: {
        getStart: () => correctedStartPos.x + this.returnAdjustPosition.x,
        getEnd: () =>
          // Phaserの仕様上、オプショナルが必要なため、こちらの警告は無効にします
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          startPos!.x + GRID_SIZE * dx + this.returnAdjustPosition.x,
      },
      // X座標の移動を設定
      y: {
        getStart: () => correctedStartPos.y + this.returnAdjustPosition.y,
        getEnd: () =>
          // Phaserの仕様上、オプショナルが必要なため、こちらの警告は無効にします
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          startPos!.y + this.returnAdjustPosition.y + GRID_SIZE * dy,
      },
      // アニメーションの時間
      duration: DURATION,
      // アニメーション終了時に発火するコールバック
      onComplete: () => {
        nameTween.stop() // Tweenオブジェクトの削除
      },
    })
    this.nameTween = nameTween
  }

  /**
   * プレイヤーの再描画。
   * @param scene
   * @param target 再描画対象のsprite。省略するとインスタンスのheroが設定される
   * @param textureName texture名
   * @param direction プレイヤーの向き。省略するとインスタンスのdirectionの値が設定される。
   */
  public redraw(
    textureName: string,
    target: any = undefined,
    direction: Direction = ''
  ): void {
    direction ||= this.direction
    target ||= this.hero
    const frame = target.frame.name

    target.setTexture(textureName, frame)
  }

  public removeWalkAnim(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.hero!.anims.remove('walk_front')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.hero!.anims.remove('walk_back')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.hero!.anims.remove('walk_left')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.hero!.anims.remove('walk_right')
  }

  public static addPlayer(id: string, addedPlayer: Player): void {
    Player.allPlayers.set(id, addedPlayer)
  }

  public static damage(
    scene: Scene,
    damageInfo: ReceivedDamageInfo
  ): void {
    const allPlayers = Player.allPlayers.get(damageInfo.target)
    if (allPlayers !== undefined) {
      allPlayers.decreaseHp(scene, damageInfo.damage)
    }
  }

  public static socketOn(scene: Scene, socket: Socket): void {
    socket.on('damage', Player.damage)
  }
}
