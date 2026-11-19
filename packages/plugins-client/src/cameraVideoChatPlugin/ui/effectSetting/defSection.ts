import type { SettingSection } from '@churaverse/core-ui-plugin-client'
import type { CameraEffectId } from '../../interface/IVideoSender'

export const CAMERA_EFFECT_SETTING_SECTION_ID = 'cameraEffect'

type CameraEffectNameMapper = {
  [key in CameraEffectId]: string
}
export const CAMERA_EFFECT_NAME_MAPPER: CameraEffectNameMapper = {
  dummy: 'なし',
  blur: 'ぼかし',
  virtualBackground: 'カスタム背景',
}

export const imageSelectorID = 'virtualBackgroundImageSelector'
export const imageSelectorButtonId = 'virtualBackgroundImageSelectorButton'

export const removeBackgroundImageButton = 'removeVirtualBackgroundImageButton'

export const effectIdToElementId = (effectId: CameraEffectId): string => {
  return `VideoEffector_${effectId}`
}

declare module '@churaverse/core-ui-plugin-client' {
  export interface SettingDialogSectionMap {
    cameraEffectSetting: SettingSection
  }
}
