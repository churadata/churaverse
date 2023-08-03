import { Scene } from 'phaser'
import { PLAYER_COLOR_NAMES, PlayerColorName } from '../../../../domain/model/types'
import { PlayerColorChangeUseCase } from '../../../../usecase/playerColorChangeUseCase'

/**
 * ボタンのテクスチャ名
 */
export const TEXTURE_KEYS: { [key in PlayerColorName]: `${key}Button` } = {
  basic: 'basicButton',
  red: 'redButton',
  black: 'blackButton',
  blue: 'blueButton',
  gray: 'grayButton',
}

/**
 * ボタンのテクスチャの色とファイル名
 */
export const TEXTURE_FILENAMES: { [key in PlayerColorName]: string } = {
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
 * プレイヤーの色を変更するボタンの基礎となるクラス
 * 画面への描画とInteractorに渡す部分をサブクラスに担当させる
 */
export class PlayerColorButtons {
  protected interactor?: PlayerColorChangeUseCase
  protected readonly playerId: string
  protected colorButtons = new Map<PlayerColorName, ColorButton>()

  protected constructor(scene: Scene, playerId: string, selectedColor: PlayerColorName) {
    this.playerId = playerId

    // ボタンの作成
    this.createColorChangeButtons(scene)

    this.switchButtons(selectedColor)
  }

  /**
   * 色を変更するボタンの作成
   */
  public createColorChangeButtons(scene: Scene): void {
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
  private switchButtons(turnOnColor: PlayerColorName): void {
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

  public setInteractor(interactor: PlayerColorChangeUseCase): void {
    this.interactor = interactor
  }

  /**
   * ボタンクリック時に実行する関数
   */
  private onClick(color: PlayerColorName): void {
    if (this.interactor !== undefined) {
      this.interactor.changePlayerColor(this.playerId, color)
      this.switchButtons(color)
    }
  }
}
