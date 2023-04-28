import { Scene } from 'phaser'
import { PLAYER_COLOR_NAMES, PlayerColorName } from '../../domain/model/types'
import { Interactor } from '../../interactor/Interactor'
import { DEFAULT_COLOR_NAME } from '../Render/playerRender'
import { SettingDialog } from './settingDialog'

/**
 * ボタンのテクスチャ名
 */
const TEXTURE_KEYS: { [key in PlayerColorName]: `${key}Button` } = {
  basic: 'basicButton',
  red: 'redButton',
  black: 'blackButton',
  blue: 'blueButton',
  gray: 'grayButton',
}

/**
 * ボタンのテクスチャの色とファイル名
 */
const TEXTURE_FILENAMES: { [key in PlayerColorName]: string } = {
  basic: 'assets/playerColorChangeButton/brown_button.png',
  red: 'assets/playerColorChangeButton/red_button.png',
  black: 'assets/playerColorChangeButton/black_button.png',
  blue: 'assets/playerColorChangeButton/blue_button.png',
  gray: 'assets/playerColorChangeButton/gray_button.png',
}

interface ColorButton {
  image: Phaser.GameObjects.Image
  isSelected: boolean
}

/**
 * プレイヤーの色を変更するボタン
 */
export class PlayerColorButtons {
  private interactor?: Interactor
  private readonly playerId: string

  private readonly colorButtons = new Map<PlayerColorName, ColorButton>()

  private constructor(scene: Scene, playerId: string, settingDialog: SettingDialog) {
    this.playerId = playerId

    // ボタンの作成
    this.createColorChangeButtons(scene)

    // ボタンの表示
    this.colorButtons.forEach((button) => {
      settingDialog.add(button.image)
    })

    this.switchButtons(DEFAULT_COLOR_NAME)
  }

  public static async build(scene: Scene, playerId: string, settingDialog: SettingDialog): Promise<PlayerColorButtons> {
    return await new Promise<void>((resolve, reject) => {
      if (scene.textures.exists(TEXTURE_KEYS[DEFAULT_COLOR_NAME])) {
        resolve()
      }

      // 各色のボタンをロード
      PLAYER_COLOR_NAMES.forEach((color) => {
        scene.load.image(TEXTURE_KEYS[color], TEXTURE_FILENAMES[color])
      })

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new PlayerColorButtons(scene, playerId, settingDialog)
    })
  }

  /**
   * 色を変更するボタンの作成
   */
  private createColorChangeButtons(scene: Scene): void {
    PLAYER_COLOR_NAMES.forEach((color: PlayerColorName, i: number) => {
      const gap = 60
      const x = -70 - gap * i
      const y = 50
      const image = this.createButtonImage(scene, color, x, y)
      this.colorButtons.set(color, { image, isSelected: false })
    })
  }

  private createButtonImage(scene: Scene, color: PlayerColorName, x: number, y: number): Phaser.GameObjects.Image {
    const buttonImg = scene.add.image(x, y, TEXTURE_KEYS[color]).setOrigin(0, 0).setScrollFactor(0).setAlpha(0.5)
    buttonImg.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
      this.onClick(color)
    })

    return buttonImg
  }

  /**
   * buttonの切り替えを行う
   * 一度に選択できるボタンは一つのみ
   **/
  public switchButtons(turnOnColor: PlayerColorName): void {
    this.colorButtons.forEach((button, color) => {
      if (turnOnColor === color) {
        button.isSelected = true
        button.image.setAlpha(1)
      } else {
        button.isSelected = false
        button.image.setAlpha(0.5)
      }
    })
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /**
   * ボタンクリック時に実行する関数
   */
  private onClick(color: PlayerColorName): void {
    if (this.interactor !== undefined) {
      this.interactor?.changePlayerColor(this.playerId, color)
      this.switchButtons(color)
    }
  }
}
