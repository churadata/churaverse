import { GameObjects, Scene } from 'phaser'
import { layerSetting } from 'churaverse-engine-client'

const BUTTON_COLOR = '#008080'

/**
 * ButtonのModeの切り替えを行うクラス
 */
export class AutoModeControlButton {
  private readonly modeControlButton: GameObjects.Text
  public autoMode: boolean
  public constructor(scene: Scene) {
    this.autoMode = false
    const buttonWidth = 15
    const buttonHeight = 10

    /**
     * 自動化と手動化をクリックで切り替えるボタン
     */
    this.modeControlButton = scene.add
      .text(20, 100, 'Auto:OFF')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setAlpha(0.75)
      .setPadding(buttonWidth, buttonHeight)
      .setFixedSize(100, 35)
      .setStyle({ backgroundColor: BUTTON_COLOR, align: 'left' })
      .setInteractive()
      .on('pointerdown', () => {
        this.clickModeControl()
        this.modeControlButton.setText(this.autoMode ? 'Auto:ON' : 'Auto:OFF')
      })
    layerSetting(this.modeControlButton, 'UI')
  }

  // ボタンがクリックされた際にautoModeプロパティを切り替えるメソッド
  public clickModeControl(): void {
    this.autoMode = !this.autoMode
  }
}
