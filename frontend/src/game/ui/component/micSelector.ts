import { Scene } from 'phaser'
import { ILocalMicrophoneManager } from '../../interactor/ILocalDeviceManager/ILocalMicrophoneManager'
import { SettingDialog } from './settingDialog'
import { Microphone } from '../../domain/model/localDevice/microphone'
import { Interactor } from '../../interactor/Interactor'
import { IMicSelector } from '../../interactor/ILocalDeviceSelector/IMicSelector'

/**
 * マイクセレクタのHTMLと紐付けるKey
 */
const MIC_SELECTOR_KEY = 'micSelector'

/**
 * マイクセレクタのHTMLのパス
 */
const MIC_SELECTOR_PATH = 'assets/deviceSelector.html'

/**
 * マイクセレクタのHTML内にあるselectタグのname
 */
const MIC_SELECT_TAG_NAME = 'deviceSelector'

export class MicSelector implements IMicSelector {
  private readonly selectTag: HTMLSelectElement
  private interactor?: Interactor

  private constructor(
    scene: Scene,
    private readonly micManager: ILocalMicrophoneManager,
    settingDialog: SettingDialog,
    microphones: Microphone[]
  ) {
    const selectorElement = scene.add.dom(-300, 120).createFromCache(MIC_SELECTOR_KEY).setOrigin(0).setScrollFactor(0)

    this.selectTag = selectorElement.getChildByName(MIC_SELECT_TAG_NAME) as HTMLSelectElement
    this.selectTag.addEventListener('change', () => this.onSelect())

    this.setOptions(microphones)

    settingDialog.add(selectorElement)
  }

  public static async build(
    scene: Scene,
    micManager: ILocalMicrophoneManager,
    settingDialog: SettingDialog,
    microphones: Microphone[]
  ): Promise<MicSelector> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(MIC_SELECTOR_KEY)) {
        resolve()
      }

      // マイクセレクタの読み込み
      scene.load.html(MIC_SELECTOR_KEY, MIC_SELECTOR_PATH)

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new MicSelector(scene, micManager, settingDialog, microphones)
    })
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /**
   * マイクを選択した際に実行するメソッド
   */
  private onSelect(): void {
    this.micManager
      .getMicrophones()
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

  /**
   * 選択肢の内容を更新する
   */
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

    this.selectTag.appendChild(option)
  }
}
