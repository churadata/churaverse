import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'
import { AdminSettingDialog } from './adminSettingDialog'
import { IInvincibleWorldModeSwitch } from '../../../../interactor/adminSetting/IInvincibleWorldModeSwitch'

/**
 * 無敵モード切り替えスイッチのHTMLのKey
 */
const INVINCIBLE_SWITCH_KEY = 'invincibleSwitch'

/**
 * 無敵モード切り替えスイッチのHTMLのパス
 */
const INVINCIBLE_SWITCH_PATH = 'assets/invincibleWorldModeSwitch.html'

/**
 * HTML内のinput要素のid
 */
const INPUT_ID = 'switchInvincibleWorldMode'

/**
 * 無敵モードの切り替えスイッチ
 */
export class InvincibleWorldModeSwitch implements IInvincibleWorldModeSwitch {
  private interactor?: Interactor
  private readonly switch: Phaser.GameObjects.DOMElement
  private readonly switchInputElement: HTMLInputElement

  private constructor(scene: Scene, private readonly playerId: string, adminSettingDialog: AdminSettingDialog) {
    this.switch = scene.add.dom(-300, 0).createFromCache(INVINCIBLE_SWITCH_KEY).setOrigin(0, 0).setScrollFactor(0)
    this.switchInputElement = this.switch.getChildByID(INPUT_ID) as HTMLInputElement

    adminSettingDialog.add(this.switch)
  }

  public static async build(
    scene: Scene,
    playerId: string,
    adminSettingDialog: AdminSettingDialog
  ): Promise<InvincibleWorldModeSwitch> {
    return await new Promise<void>((resolve, reject) => {
      if (scene.textures.exists(INVINCIBLE_SWITCH_KEY)) {
        resolve()
      }
      // 名前入力欄の読み込み
      scene.load.html(INVINCIBLE_SWITCH_KEY, INVINCIBLE_SWITCH_PATH)

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new InvincibleWorldModeSwitch(scene, playerId, adminSettingDialog)
    })
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  private toggled(): void {
    this.interactor?.toggleInvincibleWorldMode(this.playerId, this.switchInputElement.checked)
  }

  public initState(checked: boolean): void {
    this.switchInputElement.checked = checked

    this.interactor?.toggleInvincibleWorldMode(this.playerId, checked)
    // 初期状態のcheckedを設定した後にEventListen開始
    this.switchInputElement.addEventListener('change', () => {
      this.toggled()
    })
  }

  public setChecked(checked: boolean): void {
    this.switchInputElement.checked = checked
  }

  public getChecked(): boolean {
    return this.switchInputElement.checked
  }
}
