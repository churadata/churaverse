import 'phaser'
import { FRAME_RATE, GRID_SIZE } from '../const'
import { Map } from '../map'
import {
  Player,
  PlayerInfo,
  WalkAnimState,
  WalkAnimStateAry,
} from '../domain/player'
import { OwnPlayer } from '../domain/ownPlayer'
import { OtherPlayer } from '../domain/otherPlayer'
import { Bomb } from '../domain/bomb'
import { Shark } from '../domain/shark'
import { PlayerSettingsPanel } from '../ui/playerSettingsPanel'
import { Socket } from '../socket'
import { TextChat } from '../ui/textChat'
import { WebRtcChat } from '../ui/webRtcChat'
import { layerSetting } from '../layer'
import { Reload } from '../reload'
import { Keyboard } from '../keyboard'
import { uniqueId } from '../domain/util/uniqueId'

/**
 * メインシーン
 * init⇒preload⇒create⇒update⇒update⇒...
 * で動作する
 */

export interface ExistPlayersInfo {
  [id: string]: PlayerInfo
}
export interface PreloadedData {
  existPlayers: ExistPlayersInfo
}

class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Main',
      active: false,
    })
  }

  private readonly socket: Socket = new Socket()

  public keyboard!: Keyboard

  private map: Map = new Map('assets/maps/Map.json') // Map インスタンス生成
  public ownPlayer: OwnPlayer = new OwnPlayer() // OwnPlayer インスタンス生成
  private mapGroundLayer?: Phaser.Tilemaps.TilemapLayer

  private readonly playerSettingsPanel: PlayerSettingsPanel =
    new PlayerSettingsPanel(this)

  public textChat: TextChat = new TextChat(this)

  private readonly webRtcChat: WebRtcChat = new WebRtcChat(this)

  public reload: Reload = new Reload(this)

  private readonly sharks: { [id: string]: Shark } = {} // ワールド内に存在するサメ
  private readonly bombs: { [id: string]: Bomb } = {} // ワールド内に存在する爆弾
  private readonly otherPlayers: { [id: string]: OtherPlayer } = {} // ワールド内に存在する他プレイヤー

  private isFollowVideo: boolean = false

  /**
   * 初期処理
   */
  init(): void {
    this.socket.initInMainScene(this, this.socket)

    // ownPlayerクラス内でやるのはどうでしょうか
    this.ownPlayer.animState = ''
    this.ownPlayer.direction = 'down'

    this.ownPlayer.isWalking = false
    this.ownPlayer.tilePos = { tx: 20, ty: 11 }

    this.keyboard = new Keyboard(this, 'Main')

    // シーンでイベント名を指定するの良くないと思うし
    // せめて定数として定義した方がいいと思う
    this.socket.singleEmit('enterPlayer')
  }

  /**
   * アセットデータ読込などを行う処理
   */
  preload(): void {
    this.load.image('mapTiles', `assets/map_tile.png`)
    this.load.tilemapTiledJSON('mapJson', this.map.getMapPath)

    this.load.spritesheet('basicHero', 'assets/playerColor/hero.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('follower', 'assets/playerColor/hero.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('bomb', 'assets/bomb_large_explosion.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.spritesheet('shark', 'assets/shark.png', {
      frameWidth: 90,
      frameHeight: 90,
    })

    this.playerSettingsPanel.loadAssets()
    this.textChat.loadAssets()

    this.webRtcChat.loadAssets()

    this.reload.loadAssets()
  }

  /**
   * ゲーム画面の作成処理やイベントアクションを記述する処理
   */
  create(): void {
    this.requestPreloadedData()

    this.map.map = this.make.tilemap({ key: 'mapJson' }) // タイルマップ生成
    this.map.tiles = this.map.map.addTilesetImage('map_tile', `mapTiles`) // マップチップ画像のキーを渡す
    this.mapGroundLayer = this.map.map.createLayer(
      'Base',
      this.map.tiles,
      -20,
      -20
    ) // レイヤー作成

    this.ownPlayer.hero = this.add
      .sprite(800, 440, 'basicHero', 0)
      .setOrigin(0.5)
    this.ownPlayer.hero.setDisplaySize(40, 40)
    // ownplayer画像の深度設定
    layerSetting(this.ownPlayer.hero, 'OwnPlayer')

    this.moveCamera(this.ownPlayer.hero)

    for (const heroAnim of this.ownPlayer.getAnims) {
      // ヒーローアニメーションの数だけループ
      if (
        this.anims.create(
          this.ownPlayer.AnimConfig(heroAnim, this, FRAME_RATE, 'basicHero')
        ) === false
      )
        continue // もしfalseが戻って来ればこの後何もしない
    }

    for (const sharkAnim of Shark.getAnims) {
      if (
        this.anims.create(Shark.AnimConfig(sharkAnim, this, FRAME_RATE)) ===
        false
      )
        continue
    }

    for (const bombAnim of Bomb.getAnims) {
      if (
        this.anims.create(Bomb.AnimConfig(bombAnim, this, FRAME_RATE)) === false
      )
        continue
    }

    this.ownPlayer.playerColor = 'basic'
    this.ownPlayer.playerName = 'name'
    this.ownPlayer.playerNameArea = this.add
      .text(
        this.ownPlayer.hero.x + this.ownPlayer.returnAdjustPosition.x,
        this.ownPlayer.hero.y + this.ownPlayer.returnAdjustPosition.y,
        this.ownPlayer.playerName
      )
      .setOrigin(0.5)
    this.ownPlayer.id = this.socket.id
    // ownplayerの名前の深度設定
    layerSetting(this.ownPlayer.playerNameArea, 'PlayerName')

    Player.addPlayer(this.ownPlayer.id, this.ownPlayer)

    this.playerSettingsPanel.createPanel(this.ownPlayer, this.socket)
    this.playerSettingsPanel.createSettingButton()
    this.textChat.createChatButton()
    this.textChat.chatBoard(this.socket)

    this.webRtcChat.create()
  }

  /*
   * メインループ
   */
  update(): void {
    this.textChat.controlInputFieldFocus()

    if (!this.reload.reloadPanelStatus) {
      this.socket.emitIfNeeded()
    }

    if (this.keyboard.inputtingText) {
      // 名前変更時など、テキスト入力中はプレイヤーを操作できない
      if (this.keyboard.isJustDown('ENTER')) {
        if (this.textChat.panelContainer.visible) {
          this.textChat.sendChat(this.socket)
        } else if (this.playerSettingsPanel.panelContainer.visible) {
          this.playerSettingsPanel.changePlayerName(this.ownPlayer, this.socket)
        }
      }

      if (!this.ownPlayer.isWalking) this.stopPlayer()

      return
    }

    if (this.ownPlayer.isDead) return

    this.keyboard.holdCheck()

    if (this.keyboard.isDown('Z')) {
      if (this.ownPlayer.hero === undefined) return

      if (
        this.keyboard.isJustDown('Z') ||
        this.keyboard.holdFrame('Z') >= Bomb.DROP_FRAME
      ) {
        const bomb = new Bomb(
          this,
          this.ownPlayer.hero?.x,
          this.ownPlayer.hero?.y,
          this.ownPlayer.direction
        )
        this.socket.emit('bomb', bomb.info)
        this.keyboard.resetHold('Z')
      }
    }

    if (this.keyboard.isDown('X')) {
      if (this.ownPlayer.hero === undefined) return

      if (
        this.keyboard.isJustDown('X') ||
        this.keyboard.holdFrame('X') >= Shark.SHOT_FRAME
      ) {
        const shark = new Shark(
          this,
          uniqueId(),
          this.ownPlayer.hero?.x,
          this.ownPlayer.hero?.y,
          this.ownPlayer.direction
        )
        this.socket.emit('shark', shark.info)
        this.keyboard.resetHold('X')
      }
    }

    /**
     * テスト用 サメ・爆弾連射
     */

    if (!this.ownPlayer.isWalking) {
      this.gridWalk()
    }

    // 画面共有の映像にカメラを追跡する機能
    if (this.keyboard.isJustDown('V')) {
      if (this.isFollowVideo) {
        if (this.ownPlayer.hero != null) {
          this.moveCamera(this.ownPlayer.hero)
          this.isFollowVideo = false
        }
      } else {
        const video = this.webRtcChat.getVideo()
        if (video != null) {
          this.moveCamera(video)
          this.isFollowVideo = true
        }
      }
    }
    if (this.isFollowVideo && this.webRtcChat.getVideo() == null && this.ownPlayer.hero != null) {
        this.moveCamera(this.ownPlayer.hero)
        this.isFollowVideo = false
    }
  }

  private stopPlayer(): void {
    if (this.ownPlayer.animState !== '') {
      this.ownPlayer.hero?.anims.stop()
      this.ownPlayer.isWalking = false
      this.socket.emit('walk', this.ownPlayer.walkInfo(''))
      this.ownPlayer.animState = ''
    }
  }

  private gridWalk(): void {
    let heroAnimState: WalkAnimState = '' // 前回と比較用の状態格納変数
    const beforeDirection = this.ownPlayer.direction

    this.ownPlayer.isWalking = true
    // ここで状態決定（ローカルな変数に格納）
    if (this.keyboard.isDown('UP')) {
      heroAnimState = 'walk_back'
      this.ownPlayer.direction = 'up'
    } else if (this.keyboard.isDown('DOWN')) {
      heroAnimState = 'walk_front'
      this.ownPlayer.direction = 'down'
    } else if (this.keyboard.isDown('LEFT')) {
      heroAnimState = 'walk_left'
      this.ownPlayer.direction = 'left'
    } else if (this.keyboard.isDown('RIGHT')) {
      heroAnimState = 'walk_right'
      this.ownPlayer.direction = 'right'
    } else {

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const animKay = this.ownPlayer.hero!.anims.getName()
      if (
        animKay !== '' &&
        this.ownPlayer.hero?.anims.isPlaying !== undefined &&
        this.ownPlayer.hero?.anims.isPlaying &&
        WalkAnimStateAry.some((value) => value === animKay)
      ) {
        this.ownPlayer.hero?.anims.stop()
        this.socket.emit('walk', this.ownPlayer.walkInfo(heroAnimState))
      }
      this.ownPlayer.animState = ''
      this.ownPlayer.isWalking = false
      return
    }

    // この型チェックは不要にしたい
    // 進入不可タイルの設定・衝突判定
    if (
      typeof this.ownPlayer.hero?.x === 'number' &&
      typeof this.ownPlayer.hero?.y === 'number'
    ) {
      // 方向フラグ(文字型の向き情報を数値型に変換)
      const dirFlag: number[] = this.ownPlayer.returnDirFlag(
        this.ownPlayer.direction
      )

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tile = this.mapGroundLayer!.getTileAtWorldXY(
        this.ownPlayer.hero?.x + GRID_SIZE * dirFlag[0],
        this.ownPlayer.hero?.y + GRID_SIZE * dirFlag[1]
      ) as Phaser.Tilemaps.Tile | null // ワールド外はtileの値がnullになるためキャストしている

      if (tile !== null && !(tile.properties.collision as boolean)) {
        if (this.ownPlayer.animState !== heroAnimState) {
          this.ownPlayer.hero?.anims.play(heroAnimState)
          this.ownPlayer.animState = heroAnimState
        }
        this.socket.emit('walk', this.ownPlayer.walkInfo(heroAnimState))

        this.ownPlayer.gridWalkTween(
          this,
          this.ownPlayer,
          this.ownPlayer.getWalkSpeed,
          heroAnimState,
          () => {
            this.ownPlayer.isWalking = false
          }
        )
      } else if (
        beforeDirection !== this.ownPlayer.direction ||
        this.ownPlayer.hero.anims.isPlaying
      ) {
        this.socket.emit('walk', this.ownPlayer.walkInfo(''))
        this.ownPlayer.gridWalkTween(
          this,
          this.ownPlayer,
          this.ownPlayer.getWalkSpeed,
          '',
          () => {
            this.ownPlayer.isWalking = false
          }
        )

        this.socket.emit('turn', this.ownPlayer.turnInfo)
        this.ownPlayer.turn(this.ownPlayer.direction)
      } else {
        this.ownPlayer.isWalking = false
      }
    }
  }

  private usePreloadedData(preloadedData: PreloadedData): void {
    OtherPlayer.addExistPlayers(
      this,
      preloadedData.existPlayers,
      this.socket.id
    )
  }

  private requestPreloadedData(): void {
    this.socket.singleEmit(
      'requestPreloadedData',
      (preloadedData: PreloadedData) => {
        this.usePreloadedData(preloadedData)
      }
    )
  }

  private moveCamera(target: Phaser.GameObjects.GameObject): void {
    this.cameras.main.startFollow(target)
  }
}

export default MainScene
