import { Dummy, BackgroundBlur, VirtualBackground } from '@livekit/track-processors'
import { TrackProcessor, Track } from 'livekit-client'
import { LocalStorageWrapper } from '../localDeviceManager/localStorageWrapper'

const effectMode = ['dummy', 'blur', 'virtualBackground'] as const
type EffectMode = typeof effectMode[number]

export class CameraEffectManager {
  private virtualBackgroundImagePath: string = ''
  private virtualBackgroundMode: string = 'dummy'
  private readonly effectModeStorage: LocalStorageWrapper<EffectMode> = new LocalStorageWrapper<EffectMode>(
    'virtualBackgroundMode'
  )

  private readonly virtualBackgroundImagePathStorage: LocalStorageWrapper<string> = new LocalStorageWrapper<string>(
    'virtualBackgroundImagePath'
  )

  public constructor() {
    this.virtualBackgroundImagePath = this.virtualBackgroundImagePathStorage.get() ?? ''
    this.virtualBackgroundMode = this.effectModeStorage.get() ?? ''
  }

  /**
   *
   * @param mode
   * @returns
   */
  public setEffecter(mode: string): TrackProcessor<Track.Kind> {
    let newProcessor = Dummy()

    if (mode === 'dummy') {
      newProcessor = Dummy()
      this.effectModeStorage.set('dummy')
    } else if (mode === 'blur') {
      newProcessor = BackgroundBlur(30)
      this.effectModeStorage.set('blur')
    } else if (mode === 'virtualBackground') {
      this.virtualBackgroundImagePath = this.virtualBackgroundImagePathStorage.get() ?? ''
      newProcessor = VirtualBackground(this.virtualBackgroundImagePath)
      this.effectModeStorage.set('virtualBackground')
    } else {
      newProcessor = Dummy()
    }
    this.virtualBackgroundMode = mode
    return newProcessor
  }

  public get virtualBackgroundModeName(): string {
    return this.virtualBackgroundMode
  }

  public updateVirtualBackgroundImagePath(path: string): void {
    this.virtualBackgroundImagePath = path
    this.virtualBackgroundImagePathStorage.set(path)
  }

  public getEffecter(): TrackProcessor<Track.Kind> {
    const mode = this.effectModeStorage.get()
    if (mode == null) {
      return Dummy()
    }
    return this.setEffecter(mode)
  }
}
