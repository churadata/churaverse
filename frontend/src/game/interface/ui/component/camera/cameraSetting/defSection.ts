import { SettingSection } from '../../settingDialog/settingSection'
import { CameraEffectId } from '../../../../../interactor/webCamera/ICameraVideoSender'

declare module '../..//settingDialog/settingDialog' {
  export interface SettingSectionMap {
    cameraEffect: SettingSection
  }
}

export const CAMERA_EFFECT_SETTING_SECTION_ID = 'cameraEffect'

type CameraEffectNameMapper = {
  [key in CameraEffectId]: string
}
export const CAMERA_EFFECT_NAME_MAPPER: CameraEffectNameMapper = {
  dummy: 'なし',
  blur: 'ぼかし',
  virtualBackground: 'カスタム背景',
}

export const effectIdToElementId = (effectId: CameraEffectId): string => {
  return `VideoEffector_${effectId}`
}

export const imageSelectorID = 'virtualBackgroundImageSelector'

export const removeBackgroundImageButton = 'removeVirtualBackgroundImageButton'
