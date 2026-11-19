import type { ISettingDialog } from '@churaverse/core-ui-plugin-client'
import type { IDataPersistence } from '@churaverse/data-persistence-plugin-client'
import type { IEventBus, IMainScene } from 'churaverse-engine-client'
import type { Camera } from '../../domain/localDevice/camera'
import type { ILocalCameraManager } from '../../interface/ILocalDeviceManager/ILocalCameraManager'
import { CameraSelectorComponent } from './components/CameraSelectorComponent'
import { DeviceSelector } from './deviceSelector'

/**
 * カメラセレクタのHTML内にあるselectタグのid
 */
export const CAMERA_SELECT_TAG_ID = 'cameraSelector'

export class CameraSelector extends DeviceSelector<Camera> {
  public constructor(
    eventBus: IEventBus<IMainScene>,
    localCameraManager: ILocalCameraManager,
    dataPersistence: IDataPersistence,
    settingDialog: ISettingDialog,
    cameras: Camera[]
  ) {
    super(
      eventBus,
      localCameraManager,
      dataPersistence,
      'cameraId',
      settingDialog,
      cameras,
      CAMERA_SELECT_TAG_ID,
      CameraSelectorComponent
    )
  }
}
