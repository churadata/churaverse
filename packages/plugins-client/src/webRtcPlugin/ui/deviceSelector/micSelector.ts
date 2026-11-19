import type { ISettingDialog } from '@churaverse/core-ui-plugin-client'
import type { IDataPersistence } from '@churaverse/data-persistence-plugin-client'
import type { IEventBus, IMainScene } from 'churaverse-engine-client'
import type { Microphone } from '../../domain/localDevice/microphone'
import type { ILocalMicrophoneManager } from '../../interface/ILocalDeviceManager/ILocalMicrophoneManager'
import { MicSelectorComponent } from './components/MicSelectorComponent'
import { DeviceSelector } from './deviceSelector'

/**
 * マイクセレクタのHTML内にあるselectタグのid
 */
export const MIC_SELECT_TAG_ID = 'micSelector'

export class MicSelector extends DeviceSelector<Microphone> {
  public constructor(
    eventBus: IEventBus<IMainScene>,
    localMicManager: ILocalMicrophoneManager,
    dataPersistence: IDataPersistence,
    settingDialog: ISettingDialog,
    mics: Microphone[]
  ) {
    super(
      eventBus,
      localMicManager,
      dataPersistence,
      'microphoneId',
      settingDialog,
      mics,
      MIC_SELECT_TAG_ID,
      MicSelectorComponent
    )
  }
}
