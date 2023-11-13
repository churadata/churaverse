import { Scene } from 'phaser'
import { Interactor } from '../../../../../interactor/Interactor'
import { SettingDialog } from '../../settingDialog/settingDialog'
import { CameraEffectManager } from '../../../../webCamera/cameraEffectManager'
import { SettingSection } from '../../settingDialog/settingSection'
import { DomManager } from '../../../util/domManager'
import { CameraEffectSelector } from './components/CameraEffectSelector'
import { imageSelectorID, effectIdToElementId, removeBackgroundImageButton } from './defSection'
import { CAMERA_EFFECT_IDS, CameraEffectId } from '../../../../../interactor/webCamera/ICameraVideoSender'

/**
 * エフェクト欄
 */
export class CameraEffectForm {
  private interactor?: Interactor
  private readonly playerId: string

  private readonly effectManager: CameraEffectManager = new CameraEffectManager()

  public constructor(scene: Scene, playerId: string, settingDialog: SettingDialog) {
    this.playerId = playerId

    const recentEffect = localStorage.getItem('virtualBackgroundMode') ?? 'dummy'
    const domElement = DomManager.jsxToDom(
      CameraEffectSelector({
        defaultMode: recentEffect,
      })
    )
    const settingSection = new SettingSection('cameraEffect', 'カメラエフェクト')
    settingDialog.addSection(settingSection)
    settingDialog.addContent('cameraEffect', domElement)

    this.setupComponent()
  }

  private setupComponent(): void {
    CAMERA_EFFECT_IDS.forEach((id) => {
      const button = DomManager.getElementById<HTMLInputElement>(effectIdToElementId(id))
      button.onclick = async () => {
        await this.buttonOnClick(button.value as CameraEffectId)
      }
    })

    const fileSelector = DomManager.getElementById<HTMLInputElement>(imageSelectorID)
    fileSelector.onchange = async () => {
      await this.fileSelectorOnChange(fileSelector.files)
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
  }

  private updateSelectedFile(): void {
    const selectedFile = DomManager.getElementById<HTMLParagraphElement>('currentSelectedFile')
    const selectedImage = DomManager.getElementById<HTMLImageElement>('currentSelectedImage')
    selectedFile.innerText = localStorage.getItem('BackgroundImageName') ?? '未選択'
    selectedImage.src = localStorage.getItem('virtualBackgroundImagePath') ?? ''
  }

  private async buttonOnClick(value: CameraEffectId): Promise<void> {
    const isCurrentImageEmpty = (localStorage.getItem('virtualBackgroundImagePath') ?? '') === ''
    if (value === 'virtualBackground' && isCurrentImageEmpty) {
      const fileSelector = DomManager.getElementById<HTMLInputElement>(imageSelectorID)
      fileSelector.click()
    }
    this.effectManager.setEffecter(value)
    if (this.interactor != null) {
      await this.interactor.setCameraEffect(value)
    } else {
      console.log('interactor is null')
    }
  }

  private async fileSelectorOnChange(fileInfo: FileList | null): Promise<void> {
    const fileReader = new FileReader()
    fileReader.onload = async (event) => {
      const imageURL = event.target?.result
      if (imageURL != null && typeof imageURL === 'string') {
        try {
          this.effectManager.updateVirtualBackgroundImagePath(imageURL)
        } catch (e: unknown) {
          console.error('画像を設定することができませんでした。')
          return
        }
        if (this.interactor != null && this.effectManager.virtualBackgroundModeName === 'virtualBackground') {
          this.effectManager.setEffecter('virtualBackground')
          await this.interactor?.setCameraEffect('virtualBackground')
        }
      }
      this.updateSelectedFile()
    }
    if (fileInfo != null && fileInfo.length > 0) {
      fileReader.readAsDataURL(fileInfo[0])
      localStorage.setItem('BackgroundImageName', fileInfo[0].name)
    } else {
      localStorage.setItem('BackgroundImageName', '')
      this.effectManager.updateVirtualBackgroundImagePath('')
      this.updateSelectedFile()
      if (this.interactor != null && this.effectManager.virtualBackgroundModeName === 'virtualBackground') {
        this.effectManager.setEffecter('virtualBackground')
        await this.interactor?.setCameraEffect('virtualBackground')
      }
    }
  }

  public static async build(scene: Scene, playerId: string, settingDialog: SettingDialog): Promise<CameraEffectForm> {
    return new CameraEffectForm(scene, playerId, settingDialog)
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}

declare module '../../settingDialog/settingDialog' {
  export interface SettingDialogSectionMap {
    cameraEffect: SettingSection
  }
}
