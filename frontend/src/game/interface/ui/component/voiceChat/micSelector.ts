import { Scene } from 'phaser'
import { ILocalMicrophoneManager } from '../../../../interactor/ILocalDeviceManager/ILocalMicrophoneManager'
import { SettingDialog } from '../settingDialog/settingDialog'
import { Microphone } from '../../../../domain/model/localDevice/microphone'
import { Interactor } from '../../../../interactor/Interactor'
import { IMicSelector } from '../../../../interactor/ILocalDeviceSelector/IMicSelector'
import { DomManager } from '../../util/domManager'
import { MicSelectorComponent } from './components/MicSelectorComponent'
import { SettingSection } from '../settingDialog/settingSection'

/**
 * マイクセレクタのHTML内にあるselectタグのid
 */
export const MIC_SELECT_TAG_ID = 'micSelector'

export class MicSelector implements IMicSelector {
  private readonly selectTag: HTMLSelectElement
  private interactor?: Interactor

  private constructor(
    scene: Scene,
    private readonly micManager: ILocalMicrophoneManager,
    settingDialog: SettingDialog,
    microphones: Microphone[]
  ) {
    const content = DomManager.jsxToDom(MicSelectorComponent({ microphones }))
    settingDialog.addContent('peripheralSetting', content)

    this.selectTag = DomManager.getElementById<HTMLSelectElement>(MIC_SELECT_TAG_ID)
    this.selectTag.addEventListener('change', () => this.onSelect())
  }

  public static async build(
    scene: Scene,
    micManager: ILocalMicrophoneManager,
    settingDialog: SettingDialog,
    microphones: Microphone[]
  ): Promise<MicSelector> {
    return new MicSelector(scene, micManager, settingDialog, microphones)
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /**
   * マイクを選択した際に実行するメソッド
   */
  private onSelect(): void {
    this.micManager
      .getDevices()
      .then((microphones) => {
        microphones.forEach((mic) => {
          if (mic.id === this.selectTag.value) {
            this.interactor?.switchMicrophone(mic)
          }
        })
      })
      .catch(() => {
        console.error('マイクを取得できませんでした')
      })
  }

  public updateLocalMicrophones(microphones: Microphone[]): void {
    this.setOptions(microphones)

    for (const option of this.selectTag.options) {
      if (option.value === microphones[0].id) {
        option.selected = true
        return
      }
    }
  }

  /**
   * セレクトタグに選択肢を定義する
   */
  private setOptions(microphones: Microphone[]): void {
    // 既にある選択肢を全て削除
    while (this.selectTag.firstChild != null) {
      this.selectTag.removeChild(this.selectTag.firstChild)
    }

    for (const mic of microphones) {
      this.addOption(mic)
    }
  }

  /**
   * セレクトタグに選択肢を追加する
   */
  private addOption(mic: Microphone): void {
    const option = document.createElement('option')
    option.value = mic.id
    option.textContent = mic.name

    const noMicrophoneDeviceMsg = '利用可能なマイクを取得できません'
    if (option.textContent === '') {
      option.textContent = noMicrophoneDeviceMsg
    }

    this.selectTag.appendChild(option)
  }
}

declare module '../settingDialog/settingDialog' {
  export interface SettingDialogSectionMap {
    peripheralSetting: SettingSection
  }
}
