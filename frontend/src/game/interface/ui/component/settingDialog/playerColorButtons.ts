import { Scene } from 'phaser'
import { PLAYER_COLOR_NAMES, PlayerColorName } from '../../../../domain/model/types'
import { PlayerColorChangeUseCase } from '../../../../usecase/playerColorChangeUseCase'
import { SettingDialog } from './settingDialog'
import { DomManager } from '../../util/domManager'
import { PlayerColorButtonsComponent } from './components/PlayerColorButtonsComponent'
import { SettingSection } from './settingSection'
import { DomInputObserver } from '../../util/domInputObserver'

export const PLAYER_COLOR_BUTTON_ID: (colorName: PlayerColorName) => string = (colorName) => {
  return `playerColorButton-${colorName}`
}

/**
 * プレイヤーの色を変更するボタン
 */
export class PlayerColorButtons {
  protected interactor?: PlayerColorChangeUseCase
  protected readonly playerId: string
  protected colorButtons = new Map<PlayerColorName, HTMLInputElement>()

  protected constructor(
    scene: Scene,
    playerId: string,
    selectedColor: PlayerColorName,
    settingDialog: SettingDialog,
    domInputObserver: DomInputObserver
  ) {
    this.playerId = playerId

    const buttons = DomManager.jsxToDom(PlayerColorButtonsComponent({ defaultColor: selectedColor }))
    settingDialog.addSection(new SettingSection('playerColorButtons', '色を変更'))
    settingDialog.addContent('playerColorButtons', buttons)

    this.setupButtons(domInputObserver)
  }

  public static async build(
    scene: Scene,
    playerId: string,
    selectedColor: PlayerColorName,
    settingDialog: SettingDialog,
    domInputObserver: DomInputObserver
  ): Promise<PlayerColorButtons> {
    return new PlayerColorButtons(scene, playerId, selectedColor, settingDialog, domInputObserver)
  }

  private setupButtons(domInputObserver: DomInputObserver): void {
    PLAYER_COLOR_NAMES.forEach((color) => {
      const button = DomManager.getElementById<HTMLInputElement>(PLAYER_COLOR_BUTTON_ID(color))
      domInputObserver.addTargetDom(button)

      this.colorButtons.set(color, button)

      button.onclick = () => {
        this.onClick(color)
      }
    })
  }

  /**
   * ボタンクリック時に実行する関数
   */
  private onClick(color: PlayerColorName): void {
    this.interactor?.changePlayerColor(this.playerId, color)
  }

  public setInteractor(interactor: PlayerColorChangeUseCase): void {
    this.interactor = interactor
  }
}

declare module './settingDialog' {
  export interface SettingDialogSectionMap {
    playerColorButtons: SettingSection
  }
}
