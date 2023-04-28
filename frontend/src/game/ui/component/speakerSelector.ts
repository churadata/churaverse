import { Scene } from 'phaser'
import { SettingDialog } from './settingDialog'
import { Speaker } from '../../domain/model/localDevice/speaker'
import { Interactor } from '../../interactor/Interactor'
import { ILocalSpeakerManager } from '../../interactor/ILocalDeviceManager/ILocalSpeakerManager'
import { ISpeakerSelector } from '../../interactor/ILocalDeviceSelector/ISpeakerSelector'

/**
 * スピーカーセレクタのHTMLと紐付けるKey
 */
const SPEAKER_SELECTOR_KEY = 'speakerSelector'

/**
 * スピーカーセレクタのHTMLのパス
 */
const SPEAKER_SELECTOR_PATH = 'assets/deviceSelector.html'

/**
 * スピーカーセレクタのHTML内にあるselectタグのname
 */
const SPEAKER_SELECT_TAG_NAME = 'deviceSelector'

export class SpeakerSelector implements ISpeakerSelector {
  private readonly selectTag: HTMLSelectElement
  private interactor?: Interactor

  private constructor(
    scene: Scene,
    private readonly speakerManager: ILocalSpeakerManager,
    settingDialog: SettingDialog,
    speaker: Speaker[]
  ) {
    const selectorElement = scene.add
      .dom(-300, 150)
      .createFromCache(SPEAKER_SELECTOR_KEY)
      .setOrigin(0)
      .setScrollFactor(0)

    this.selectTag = selectorElement.getChildByName(SPEAKER_SELECT_TAG_NAME) as HTMLSelectElement
    this.selectTag.addEventListener('change', () => this.onSelect())

    this.setOptions(speaker)

    settingDialog.add(selectorElement)
  }

  public static async build(
    scene: Scene,
    speakerManager: ILocalSpeakerManager,
    settingDialog: SettingDialog,
    speaker: Speaker[]
  ): Promise<SpeakerSelector> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(SPEAKER_SELECTOR_KEY)) {
        resolve()
      }

      // スピーカーセレクタの読み込み
      scene.load.html(SPEAKER_SELECTOR_KEY, SPEAKER_SELECTOR_PATH)

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new SpeakerSelector(scene, speakerManager, settingDialog, speaker)
    })
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /**
   * スピーカーを選択した際に実行するメソッド
   */
  private onSelect(): void {
    this.speakerManager
      .getSpeakers()
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

  /**
   * 選択肢の内容を更新する
   */
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

    this.selectTag.appendChild(option)
  }
}
