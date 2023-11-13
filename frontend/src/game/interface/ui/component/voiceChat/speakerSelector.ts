import { Scene } from 'phaser'
import { SettingDialog } from '../settingDialog/settingDialog'
import { Speaker } from '../../../../domain/model/localDevice/speaker'
import { Interactor } from '../../../../interactor/Interactor'
import { ILocalSpeakerManager } from '../../../../interactor/ILocalDeviceManager/ILocalSpeakerManager'
import { ISpeakerSelector } from '../../../../interactor/ILocalDeviceSelector/ISpeakerSelector'
import { DomManager } from '../../util/domManager'
import { SpeakerSelectorComponent } from './components/SpeakerSelectorComponent'
import { SettingSection } from '../settingDialog/settingSection'

/**
 * スピーカーセレクタのHTML内にあるselectタグのid
 */
export const SPEAKER_SELECT_TAG_ID = 'speakerSelector'

export class SpeakerSelector implements ISpeakerSelector {
  private readonly selectTag: HTMLSelectElement
  private interactor?: Interactor

  private constructor(
    scene: Scene,
    private readonly speakerManager: ILocalSpeakerManager,
    settingDialog: SettingDialog,
    speakers: Speaker[]
  ) {
    const content = DomManager.jsxToDom(SpeakerSelectorComponent({ speakers }))
    settingDialog.addContent('peripheralSetting', content)

    this.selectTag = DomManager.getElementById<HTMLSelectElement>(SPEAKER_SELECT_TAG_ID)
    this.selectTag.addEventListener('change', () => this.onSelect())
  }

  public static async build(
    scene: Scene,
    speakerManager: ILocalSpeakerManager,
    settingDialog: SettingDialog,
    speaker: Speaker[]
  ): Promise<SpeakerSelector> {
    return new SpeakerSelector(scene, speakerManager, settingDialog, speaker)
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /**
   * スピーカーを選択した際に実行するメソッド
   */
  private onSelect(): void {
    this.speakerManager
      .getDevices()
      .then((speakers) => {
        speakers.forEach((speaker) => {
          if (speaker.id === this.selectTag.value) {
            this.interactor?.switchSpeaker(speaker)
          }
        })
      })
      .catch(() => {
        console.error('スピーカーを取得できませんでした')
      })
  }

  public updateLocalSpeakers(speakers: Speaker[]): void {
    this.setOptions(speakers)

    for (const option of this.selectTag.options) {
      if (option.value === speakers[0].id) {
        option.selected = true
        return
      }
    }
  }

  /**
   * セレクトタグに選択肢を定義する
   */
  private setOptions(speakers: Speaker[]): void {
    // 既にある選択肢を全て削除
    while (this.selectTag.firstChild != null) {
      this.selectTag.removeChild(this.selectTag.firstChild)
    }

    for (const speaker of speakers) {
      this.addOption(speaker)
    }
  }

  /**
   * セレクトタグに選択肢を追加する
   */
  private addOption(speaker: Speaker): void {
    const option = document.createElement('option')
    option.value = speaker.id
    option.textContent = speaker.name

    const noSpeakerDeviceMsg = '利用可能な出力デバイスを確認できません'
    if (option.textContent === '') {
      option.textContent = noSpeakerDeviceMsg
    }

    this.selectTag.appendChild(option)
  }
}

declare module '../settingDialog/settingDialog' {
  export interface SettingDialogSectionMap {
    peripheralSetting: SettingSection
  }
}
