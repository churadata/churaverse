import { Scene } from 'phaser'
import { SettingDialog } from '../settingDialog/settingDialog'
import { Camera } from '../../../../domain/model/localDevice/camera'
import { Interactor } from '../../../../interactor/Interactor'
import { ILocalCameraManager } from '../../../../interactor/ILocalDeviceManager/ILocalCameraManager'
import { ICameraSelector } from '../../../../interactor/ILocalDeviceSelector/ICameraSelector'

/**
 * カメラセレクタのHTMLと紐付けるKey
 */
const CAMERA_SELECTOR_KEY = 'cameraSelector'

/**
 * カメラセレクタのHTMLのパス
 */
const CAMERA_SELECTOR_PATH = 'assets/deviceSelector.html'

/**
 * カメラセレクタのHTML内にあるselectタグのname
 */
const CAMERA_SELECT_TAG_NAME = 'deviceSelector'

export class CameraSelector implements ICameraSelector {
  private readonly selectTag: HTMLSelectElement
  private interactor?: Interactor

  private constructor(
    scene: Scene,
    private readonly cameraManager: ILocalCameraManager,
    settingDialog: SettingDialog,
    camera: Camera[]
  ) {
    const selectorElement = scene.add
      .dom(-300, 180)
      .createFromCache(CAMERA_SELECTOR_KEY)
      .setOrigin(0)
      .setScrollFactor(0)

    this.selectTag = selectorElement.getChildByName(CAMERA_SELECT_TAG_NAME) as HTMLSelectElement
    this.selectTag.addEventListener('change', () => this.onSelect())

    this.setOptions(camera)

    settingDialog.add(selectorElement)
  }

  public static async build(
    scene: Scene,
    cameraManager: ILocalCameraManager,
    settingDialog: SettingDialog,
    camera: Camera[]
  ): Promise<CameraSelector> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(CAMERA_SELECTOR_KEY)) {
        resolve()
      }

      // カメラセレクタの読み込み
      scene.load.html(CAMERA_SELECTOR_KEY, CAMERA_SELECTOR_PATH)

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new CameraSelector(scene, cameraManager, settingDialog, camera)
    })
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

    this.selectTag.appendChild(option)
  }
}
