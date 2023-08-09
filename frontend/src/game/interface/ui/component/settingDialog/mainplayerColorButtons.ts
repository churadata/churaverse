import { Scene } from 'phaser'
import { PLAYER_COLOR_NAMES, PlayerColorName } from '../../../../domain/model/types'
import { SettingDialog } from './settingDialog'
import { PlayerColorButtons, TEXTURE_FILENAMES, TEXTURE_KEYS } from '../common/playerColorButtons'

/**
 * プレイヤーの色を変更するボタン
 */
export class MainPlayerColorButtons extends PlayerColorButtons {
  private constructor(scene: Scene, playerId: string, selectedColor: PlayerColorName, settingDialog: SettingDialog) {
    super(scene, playerId, selectedColor)

    // ボタンの表示
    this.colorButtons.forEach((button) => {
      settingDialog.add(button.image)
    })
  }

  public static async build(
    scene: Scene,
    playerId: string,
    selectedColor: PlayerColorName,
    settingDialog: SettingDialog
  ): Promise<MainPlayerColorButtons> {
    return await new Promise<void>((resolve, reject) => {
      if (scene.textures.exists(TEXTURE_KEYS[selectedColor])) {
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
      return new MainPlayerColorButtons(scene, playerId, selectedColor, settingDialog)
    })
  }
}
