import { Scene } from 'phaser'
import { SettingDialog } from '../settingDialog/settingDialog'
import { Camera } from '../../../../domain/model/localDevice/camera'
import { Interactor } from '../../../../interactor/Interactor'
import { ILocalCameraManager } from '../../../../interactor/ILocalDeviceManager/ILocalCameraManager'
import { ICameraSelector } from '../../../../interactor/ILocalDeviceSelector/ICameraSelector'
import { DomManager } from '../../util/domManager'
import { CameraSelectorComponent } from './components/CameraSelectorComponent'

/**
 * カメラセレクタのHTML内にあるselectタグのid
 */
export const CAMERA_SELECT_TAG_ID = 'cameraSelector'

export class CameraSelector implements ICameraSelector {
  private readonly selectTag: HTMLSelectElement
  private interactor?: Interactor

  private constructor(
    scene: Scene,
    private readonly cameraManager: ILocalCameraManager,
    settingDialog: SettingDialog,
    cameras: Camera[]
  ) {
    const content = DomManager.jsxToDom(CameraSelectorComponent({ cameras }))
    settingDialog.addContent('peripheralSetting', content)

    this.selectTag = DomManager.getElementById<HTMLSelectElement>(CAMERA_SELECT_TAG_ID)
    this.selectTag.addEventListener('change', () => this.onSelect())
  }

  public static async build(
    scene: Scene,
    cameraManager: ILocalCameraManager,
    settingDialog: SettingDialog,
    camera: Camera[]
  ): Promise<CameraSelector> {
    return new CameraSelector(scene, cameraManager, settingDialog, camera)
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /**
   * カメラを選択した際に実行するメソッド
   */
  private onSelect(): void {
    this.cameraManager
      .getDevices()
      .then((cameras) => {
        cameras.forEach((camera) => {
          if (camera.id === this.selectTag.value) {
            this.interactor?.switchCamera(camera)
          }
        })
      })
      .catch(() => {
        console.error('カメラを取得できませんでした')
      })
  }

  /**
   * 選択肢の内容を更新する
   */
  public updateLocalCamera(camera: Camera[]): void {
    const selectedOptionValue = this.selectTag.value
    this.setOptions(camera)

    for (const option of this.selectTag.options) {
      if (option.value === selectedOptionValue) {
        option.selected = true
        return
      }
    }
  }

  public updateLocalCameras(cameras: Camera[]): void {
    this.setOptions(cameras)

    for (const option of this.selectTag.options) {
      if (option.value === cameras[0].id) {
        option.selected = true
        return
      }
    }
  }

  /**
   * セレクトタグに選択肢を定義する
   */
  private setOptions(cameras: Camera[]): void {
    // 既にある選択肢を全て削除
    while (this.selectTag.firstChild != null) {
      this.selectTag.removeChild(this.selectTag.firstChild)
    }

    for (const camera of cameras) {
      this.addOption(camera)
    }
  }

  /**
   * セレクトタグに選択肢を追加する
   */
  private addOption(camera: Camera): void {
    const option = document.createElement('option')
    option.value = camera.id
    option.textContent = camera.name

    const noCameraDeviceMsg = '利用可能なカメラを取得できません'

    if (option.textContent === '') {
      option.textContent = noCameraDeviceMsg
    }

    this.selectTag.appendChild(option)
  }
}
