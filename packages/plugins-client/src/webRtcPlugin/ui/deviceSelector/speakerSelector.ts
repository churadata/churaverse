import type { ISettingDialog } from '@churaverse/core-ui-plugin-client'
import type { IDataPersistence } from '@churaverse/data-persistence-plugin-client'
import type { IEventBus, IMainScene } from 'churaverse-engine-client'
import type { Speaker } from '../../domain/localDevice/speaker'
import type { ILocalSpeakerManager } from '../../interface/ILocalDeviceManager/ILocalSpeakerManager'
import { SpeakerSelectorComponent } from './components/SpeakerSelectorComponent'
import { DeviceSelector } from './deviceSelector'

/**
 * スピーカーセレクタのHTML内にあるselectタグのid
 */
export const SPEAKER_SELECT_TAG_ID = 'speakerSelector'

export class SpeakerSelector extends DeviceSelector<Speaker> {
  public constructor(
    eventBus: IEventBus<IMainScene>,
    localSpeakerManager: ILocalSpeakerManager,
    dataPersistence: IDataPersistence,
    settingDialog: ISettingDialog,
    speakers: Speaker[]
  ) {
    super(
      eventBus,
      localSpeakerManager,
      dataPersistence,
      'speakerId',
      settingDialog,
      speakers,
      SPEAKER_SELECT_TAG_ID,
      SpeakerSelectorComponent
    )
  }
}
