import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'
import { AdminSettingDialog } from './adminSettingDialog'
import { DomManager } from '../../util/domManager'
import { InvincibleWorldModeSwitchComponent } from './components/InvincibleWorldModeSwitchComponent'
import { IInvincibleWorldModeSwitch } from '../../../../interactor/adminSetting/IInvincibleWorldModeSwitch'
import { AdminSettingSection } from './adminSettingSection'

/**
 * HTML内のinput要素のid
 */
const INPUT_ID = 'switchInvincibleWorldMode'

/**
 * 無敵モードの切り替えスイッチ
 */
export class InvincibleWorldModeSwitch implements IInvincibleWorldModeSwitch {
  protected interactor?: Interactor
  protected switchInputElement: HTMLInputElement

  private constructor(scene: Scene, private readonly playerId: string, adminSettingDialog: AdminSettingDialog) {
    const toggleSwitch = DomManager.addJsxDom(InvincibleWorldModeSwitchComponent({ checked: false }))
    this.switchInputElement = this.setupSwitch()

    adminSettingDialog.addSection(new AdminSettingSection('invincibleWorldModeSwitch', '無敵モード切り替え'))
    adminSettingDialog.addContent('invincibleWorldModeSwitch', toggleSwitch)
  }

  public static async build(
    scene: Scene,
    playerId: string,
    adminSettingDialog: AdminSettingDialog
  ): Promise<InvincibleWorldModeSwitch> {
    return new InvincibleWorldModeSwitch(scene, playerId, adminSettingDialog)
  }

  private setupSwitch(): HTMLInputElement {
    const toggleSwitch = DomManager.getElementById<HTMLInputElement>(INPUT_ID)

    toggleSwitch.onclick = () => {
      this.toggled()
    }

    return toggleSwitch
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

declare module './adminSettingDialog' {
  export interface AdminSettingDialogSectionMap {
    invincibleWorldModeSwitch: AdminSettingSection
  }
}
