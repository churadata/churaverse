import 'phaser'
import { FRAME_RATE } from '../const'
import MainScene from '../scene/main'
import { OwnPlayer } from '../domain/ownPlayer'
import { Socket } from '../socket'
import { ButtonsManager } from './buttonsManager'
import { TabPanel } from './tabPanel'
import { layerSetting } from '../layer'
import { Direction } from '../domain/player'

export interface EmitProfileInfo {
  heroColor: string
  heroName: string
  direction: Direction
}

export class PlayerSettingsPanel extends TabPanel {
  mainScene: MainScene
  private inputNameArea?: Phaser.GameObjects.DOMElement
  private colorButtons: { [key: string]: Phaser.GameObjects.Image } = {}

  constructor(mainScene: MainScene) {
    super(mainScene)
    this.mainScene = mainScene
  }

  public loadAssets(): void {
    this.scene.load.image('settingIcon', 'assets/gear.png')
    this.scene.load.image('settingPanel', 'assets/grey_panel.png')
    this.scene.load.image(
      'redButton',
      'assets/playerColorChangeButton/red_button.png'
    )
    this.scene.load.image(
      'basicButton',
      'assets/playerColorChangeButton/brown_button.png'
    )
    this.scene.load.image(
      'blackButton',
      'assets/playerColorChangeButton/black_button.png'
    )
    this.scene.load.image(
      'blueButton',
      'assets/playerColorChangeButton/blue_button.png'
    )
    this.scene.load.image(
      'grayButton',
      'assets/playerColorChangeButton/gray_button.png'
    )
    this.scene.load.spritesheet('redHero', 'assets/playerColor/hero_red.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.scene.load.spritesheet(
      'blackHero',
      'assets/playerColor/hero_black.png',
      { frameWidth: 32, frameHeight: 32 }
    )
    this.scene.load.spritesheet(
      'blueHero',
      'assets/playerColor/hero_blue.png',
      { frameWidth: 32, frameHeight: 32 }
    )
    this.scene.load.spritesheet(
      'grayHero',
      'assets/playerColor/hero_gray.png',
      { frameWidth: 32, frameHeight: 32 }
    )
    this.scene.load.html('nameform', 'assets/nameform.html')
  }

  public createSettingButton(): void {
    const buttonsManager = new ButtonsManager(this.scene)
    // キャラクターの色と名前の変更メニューのアイコン定義
    this.iconImage = this.scene.add
      .image(this.scene.scale.gameSize.width - 50, 50, 'settingIcon') // gameSize.width - margin - position
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setAlpha(0.5)
    // キャラクターの色・名前変更メニューアイコンの深度設定
    layerSetting(this.iconImage, 'PlayerSettingForm')

    this.iconImage.setDisplaySize(40, 40)
    this.iconImage
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        if (this.panelContainer.visible) {
          this.iconImage.setAlpha(0.5)
          this.panelContainer.visible = false
          ButtonsManager.openedPanel = undefined
        } else {
          this.iconImage.setAlpha(1)
          buttonsManager.openPanel(this)
          this.panelContainer.visible = true
        }
      })
    layerSetting(this.iconImage, 'PlayerSettingForm')

    this.scene.scale.on(
      Phaser.Scale.Events.RESIZE,
      (
        gameSize: Phaser.Structs.Size,
        baseSize: Phaser.Structs.Size,
        displaySize: Phaser.Structs.Size,
        previousWidth: number,
        previousHeight: number
      ) => {
        this.iconImage.setPosition(gameSize.width - 50, 50)
      }
    )
  }

  public createPanel(OwnPlayer: OwnPlayer, socket: Socket): void {
    const panelWidth = 340
    const panelHeight = 240

    // キャラクターの色変更メニューの作成
    this.panelContainer = this.scene.add.container(
      this.scene.scale.gameSize.width - 50 - panelWidth,
      100
    ) // gameSize.width - margin - panelWidth
    const panel = this.scene.add
      .nineslice(
        0,
        0, // xとy
        panelWidth,
        panelHeight, // オブジェクトのサイズ
        'settingPanel', // 読み込む画像
        88, // 幅と高さ
        24 // ピクセル数
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)

    // 入力フォームの定義
    this.inputNameArea = this.scene.add
      .dom(25, 40)
      .createFromCache('nameform')
      .setOrigin(0)
      .setScrollFactor(0)

    const nameField = this.inputNameArea.getChildByName('nameField')
    this.mainScene.keyboard.addCheckForcusElement(nameField) // フォーム入力中はプレイヤー操作をロック

    this.onClickNameChangeButton(OwnPlayer, socket)
    this.createColorChangeButtons(OwnPlayer, socket)

    this.panelContainer.add(panel)
    this.panelContainer.add(this.inputNameArea)

    for (const color in this.colorButtons) {
      this.panelContainer.add(this.colorButtons[color].setAlpha(0.2))
    }

    this.colorButtons[OwnPlayer.playerColor].setAlpha(1)

    this.panelContainer.visible = false
    this.panelContainer.setDepth(10)

    this.scene.scale.on(
      Phaser.Scale.Events.RESIZE,
      (
        gameSize: Phaser.Structs.Size,
        baseSize: Phaser.Structs.Size,
        displaySize: Phaser.Structs.Size,
        previousWidth: number,
        previousHeight: number
      ) => {
        this.panelContainer.setPosition(gameSize.width - 50 - panelWidth, 100)
      }
    )
  }

  private createColorChangeButtons(OwnPlayer: OwnPlayer, socket: Socket): void {
    // 色変更ボタンを作成
    const colors = ['basic', 'red', 'blue', 'gray', 'black'] // 色のバリエーション
    const width = 50
    const GAP_X = 10

    let x = 25
    const y = 120
    for (let i = 0; i < colors.length; i++) {
      const button = this.createColorChangeButton(
        OwnPlayer,
        socket,
        x,
        y,
        colors[i]
      )
      this.colorButtons[colors[i]] = button
      x += width + GAP_X
    }
  }

  private createColorChangeButton(
    OwnPlayer: OwnPlayer,
    socket: Socket,
    x: number,
    y: number,
    color: string
  ): Phaser.GameObjects.Image {
    // キャラクターの色変更ボタンの定義
    const colorChangeButton = this.scene.add
      .image(x, y, `${color}Button`)
      .setOrigin(0, 0)
      .setScrollFactor(0)

    colorChangeButton
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        const beforeColor = OwnPlayer.playerColor
        OwnPlayer.playerColor = color
        this.colorButtons[beforeColor].setAlpha(0.2)
        this.colorButtons[OwnPlayer.playerColor].setAlpha(1)

        OwnPlayer.removeWalkAnim()

        for (const heroAnim of OwnPlayer.getAnims) {
          // ヒーローアニメーションの数だけループ
          if (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            OwnPlayer.hero!.anims.create(
              OwnPlayer.AnimConfig(
                heroAnim,
                this.scene,
                FRAME_RATE,
                `${color}Hero`
              )
            ) === false
          )
            continue // もしfalseが戻って来ればこの後何もしない
        }

        OwnPlayer.redraw(`${color}Hero`)

        const profile: EmitProfileInfo = {
          heroColor: OwnPlayer.playerColor,
          heroName: OwnPlayer.playerName,
          direction: OwnPlayer.direction,
        }

        socket.emit('profile', profile)
      })
    return colorChangeButton
  }

  public changePlayerName(OwnPlayer: OwnPlayer, socket: Socket): void {
    OwnPlayer.playerName = (
      this.inputNameArea?.getChildByName('nameField') as HTMLInputElement
    ).value
    if (OwnPlayer.playerName !== '') {
      OwnPlayer.playerNameArea?.setText(OwnPlayer.playerName).setOrigin(0.5)

      const profile: EmitProfileInfo = {
        heroColor: OwnPlayer.playerColor,
        heroName: OwnPlayer.playerName,
        direction: OwnPlayer.direction,
      }
      socket.emit('profile', profile)
    }
  }

  public onClickNameChangeButton(OwnPlayer: OwnPlayer, socket: Socket): void {
    // 入力フォームのクリックイベントの定義
    if (
      this.inputNameArea !== undefined &&
      OwnPlayer.playerNameArea !== undefined
    ) {
      const inputNameArea = this.inputNameArea
      const send = document.getElementById('playername-send-button')
      if (send != null) {
        send.onclick = () => {
          OwnPlayer.playerName = (
            inputNameArea.getChildByName('nameField') as HTMLInputElement
          ).value
          this.changePlayerName(OwnPlayer, socket)
        }
      }
    }
  }
}
