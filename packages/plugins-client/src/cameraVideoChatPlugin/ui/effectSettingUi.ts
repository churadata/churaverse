import { SettingSection } from '@churaverse/core-ui-plugin-client'
import { DomManager, type IMainScene, type Store } from 'churaverse-engine-client'
import { blankPicturePath, type CameraEffectSettingStore } from '../cameraEffectSettingStore'
import type { EffectManager } from '../effectManager'
import { CAMERA_EFFECT_IDS, type CameraEffectId, type IVideoSender } from '../interface/IVideoSender'
import { CameraEffectSelector } from './effectSetting/components/CameraEffectSelector'
import {
  effectIdToElementId,
  imageSelectorButtonId,
  imageSelectorID,
  removeBackgroundImageButton,
} from './effectSetting/defSection'

export class EffectSettingUI {
  public constructor(
    store: Store<IMainScene>,
    private readonly effectManager: EffectManager,
    private readonly videoSender: IVideoSender,
    private readonly effectSettingStore: CameraEffectSettingStore
  ) {
    const uiStore = store.of('coreUiPlugin')

    const settingDialog = uiStore.settingDialog
    settingDialog.addSection(new SettingSection('cameraEffectSetting', 'カメラエフェクト'))

    const cameraEffectSelector = CameraEffectSelector({
      defaultMode: effectSettingStore.getModeName(),
    })

    settingDialog.addContent('cameraEffectSetting', DomManager.jsxToDom(cameraEffectSelector))
    this.setupComponent()
  }

  private setupComponent(): void {
    CAMERA_EFFECT_IDS.forEach((id) => {
      const button = DomManager.getElementById<HTMLInputElement>(effectIdToElementId(id))
      button.onclick = async () => {
        await this.buttonOnClick(button.value as CameraEffectId)
        this.effectSettingStore.setToLocalStorage()
      }
    })

    const fileSelector = DomManager.getElementById<HTMLInputElement>(imageSelectorID)
    fileSelector.onchange = async () => {
      await this.fileSelectorOnChange(fileSelector.files)
      this.effectSettingStore.setToLocalStorage()
    }
    const fileSelectorButton = DomManager.getElementById<HTMLButtonElement>(imageSelectorButtonId)
    fileSelectorButton.onclick = () => {
      fileSelector.click()
    }

    this.updateSelectedFile()

    const removeBackground = DomManager.getElementById<HTMLButtonElement>(removeBackgroundImageButton)
    removeBackground.onclick = async () => {
      await this.removeBackgroundImage()
    }
  }

  private async removeBackgroundImage(): Promise<void> {
    await this.fileSelectorOnChange(null)
    this.updateSelectedFile()

    // set camera effect by sender
    await this.effectManager.updateEffect(this.effectSettingStore.getImagePath())
  }

  private updateSelectedFile(): void {
    const selectedFile = DomManager.getElementById<HTMLParagraphElement>('currentSelectedFile')
    const selectedImage = DomManager.getElementById<HTMLImageElement>('currentSelectedImage')
    this.effectSettingStore.setToLocalStorage()
    selectedFile.innerText = this.effectSettingStore.getImageName() ?? '未選択'
    // 設定なしの場合に画像が表示されるのは混乱を招くので、設定なしの場合は画像を表示しない
    selectedImage.src =
      this.effectSettingStore.getImagePath() === blankPicturePath ? '' : this.effectSettingStore.getImagePath()
  }

  private async buttonOnClick(value: CameraEffectId): Promise<void> {
    const isCurrentImageEmpty =
      this.effectSettingStore.getImagePath() === '' || this.effectSettingStore.getImagePath() === blankPicturePath

    if (value === 'virtualBackground' && isCurrentImageEmpty) {
      const fileSelector = DomManager.getElementById<HTMLInputElement>(imageSelectorID)
      fileSelector.click()
    }
    this.effectManager.setEffectMode(value)

    // set camera effect by sender
    await this.videoSender.setEffect(value)
  }

  private async fileSelectorOnChange(fileInfo: FileList | null): Promise<void> {
    const fileReader = new FileReader()
    fileReader.onload = async (event) => {
      const imageURL = event.target?.result
      if (imageURL != null && typeof imageURL === 'string') {
        try {
          this.effectSettingStore.setImage(imageURL, fileInfo?.[0].name ?? '')
          await this.effectManager.updateEffect(imageURL)
        } catch (e: unknown) {
          console.error('画像を設定することができませんでした。', e)
          return
        }

        const effectMode = this.effectManager.getEffectMode()
        if (effectMode != null && effectMode === 'virtualBackground') {
          this.effectManager.setEffectMode('virtualBackground')
        }
      }
      this.updateSelectedFile()
    }
    if (fileInfo != null && fileInfo.length > 0) {
      fileReader.readAsDataURL(fileInfo[0])
    } else {
      this.effectSettingStore.setImage(blankPicturePath, '未選択')
      this.updateSelectedFile()
      if (this.effectManager.getEffectMode() === 'virtualBackground') {
        const imagePath = this.effectSettingStore.getImagePath()
        await this.effectManager.updateEffect(imagePath)
      }
    }
  }
}
