import {
  BackgroundBlur,
  type BackgroundOptions,
  type ProcessorWrapper,
  VirtualBackground,
} from '@livekit/track-processors'
import type { CameraEffectSettingStore } from './cameraEffectSettingStore'
import type { CameraEffectId } from './interface/IVideoSender'

export class EffectManager {
  private currentEffectMode: CameraEffectId = 'dummy'
  private readonly effectMap = new Map<CameraEffectId, ProcessorWrapper<BackgroundOptions> | undefined>()
  private readonly blurRadius = 10

  public constructor(private readonly effectSettingStore: CameraEffectSettingStore) {
    this.currentEffectMode = this.effectSettingStore.getModeName()
    // dummy: エフェクトなしと同等
    this.effectMap.set('dummy', undefined)

    // blur: ブラーをかける
    this.effectMap.set('blur', BackgroundBlur(this.blurRadius))

    // virtualBackground: 仮想背景を適用する

    // 仮想背景の画像を取得
    const virtualBackgroundImagePath = effectSettingStore.getImagePath()
    this.effectMap.set('virtualBackground', VirtualBackground(virtualBackgroundImagePath))
  }

  public setEffectMode(effectMode: CameraEffectId): void {
    this.currentEffectMode = effectMode
    this.effectSettingStore.setModeName(effectMode)
  }

  public getEffect(): ProcessorWrapper<BackgroundOptions> | undefined {
    const imagePath = this.effectSettingStore.getImagePath()
    switch (this.currentEffectMode) {
      case 'blur':
        this.effectMap.set('blur', BackgroundBlur(this.blurRadius))
        return this.effectMap.get('blur')
      case 'virtualBackground':
        this.effectMap.set('virtualBackground', VirtualBackground(imagePath))
        return this.effectMap.get('virtualBackground')
      default:
        return this.effectMap.get('dummy')
    }
  }

  public getEffectMode(): CameraEffectId {
    return this.currentEffectMode
  }

  public async updateEffect(blurRadius: number): Promise<void>
  public async updateEffect(imagePath: string): Promise<void>

  public async updateEffect(blurRadiusOrImagePath: number | string): Promise<void> {
    if (typeof blurRadiusOrImagePath === 'number' && this.currentEffectMode === 'blur') {
      await this.effectMap.get('blur')?.updateTransformerOptions({ blurRadius: blurRadiusOrImagePath })
    } else if (typeof blurRadiusOrImagePath === 'string' && this.currentEffectMode === 'virtualBackground') {
      const virtualBackground = this.effectMap.get('virtualBackground')
      if (virtualBackground != null) {
        await virtualBackground.updateTransformerOptions({ imagePath: blurRadiusOrImagePath })
      }
    }
  }
}
