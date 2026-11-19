import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import type { CameraEffectId } from './interface/IVideoSender'
import '@churaverse/data-persistence-plugin-client'

export interface CameraVideoChatPluginKeyNameMap {
  virtualBackgroundModeName: CameraEffectId
  backgroundImageName: string
  virtualBackgroundImagePath: string
}

declare module '@churaverse/data-persistence-plugin-client' {
  export interface PersistentDataMap {
    cameraVideoChat: CameraVideoChatPluginKeyNameMap
  }
}

// 設定がないときに背景に設定する画像
// 下のbase64文字列は、1x1の黒色の画像を表している。
export const blankPicturePath =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='

interface CameraEffectSetting {
  virtualBackgroundImagePath: string
  virtualBackgroundModeName: CameraEffectId
  backgroundImageName: string
}

export class CameraEffectSettingStore {
  private readonly effectSetting: CameraEffectSetting = {
    virtualBackgroundImagePath: blankPicturePath,
    virtualBackgroundModeName: 'dummy',
    backgroundImageName: '未選択',
  }

  public constructor(
    readonly _bus: IEventBus<IMainScene>,
    private readonly store: Store<IMainScene>
  ) {
    this.effectSetting.virtualBackgroundImagePath =
      this.store.of('dataPersistencePlugin').dataPersistence.get('cameraVideoChat', 'virtualBackgroundImagePath') ??
      blankPicturePath
    this.effectSetting.virtualBackgroundModeName =
      this.store.of('dataPersistencePlugin').dataPersistence.get('cameraVideoChat', 'virtualBackgroundModeName') ??
      'dummy'
    this.effectSetting.backgroundImageName =
      this.store.of('dataPersistencePlugin').dataPersistence.get('cameraVideoChat', 'backgroundImageName') ?? '未選択'
  }

  public setToLocalStorage(): void {
    this.store
      .of('dataPersistencePlugin')
      .dataPersistence.add(
        'cameraVideoChat',
        'virtualBackgroundImagePath',
        this.effectSetting.virtualBackgroundImagePath
      )
    this.store
      .of('dataPersistencePlugin')
      .dataPersistence.add('cameraVideoChat', 'virtualBackgroundModeName', this.effectSetting.virtualBackgroundModeName)
    this.store
      .of('dataPersistencePlugin')
      .dataPersistence.add('cameraVideoChat', 'backgroundImageName', this.effectSetting.backgroundImageName)
  }

  public setImage(path: string, name: string): void {
    this.setImagePath(path)
    this.setImageName(name)
  }

  public setImagePath(path: string): void {
    this.effectSetting.virtualBackgroundImagePath = path
  }

  public setImageName(name: string): void {
    this.effectSetting.backgroundImageName = name
  }

  public setModeName(mode: CameraEffectId): void {
    this.effectSetting.virtualBackgroundModeName = mode
  }

  public getImagePath(): string {
    return this.effectSetting.virtualBackgroundImagePath
  }

  public getImageName(): string {
    return this.effectSetting.backgroundImageName
  }

  public getModeName(): CameraEffectId {
    return this.effectSetting.virtualBackgroundModeName
  }
}
