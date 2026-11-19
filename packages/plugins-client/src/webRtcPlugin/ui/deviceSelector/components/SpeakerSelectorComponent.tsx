import dialogStyle from '@churaverse/core-ui-plugin-client/settingDialog/style.module.scss'
import type { JSXFunc } from 'churaverse-engine-client'
import type { Speaker } from '../../../domain/localDevice/speaker'
import { SPEAKER_SELECT_TAG_ID } from '../speakerSelector'
import { DeviceSelectorComponent } from './DeviceSelectorComponent'
import style from './SpeakerSelectorComponent.module.scss'

interface Props {
  devices: Speaker[]
}

export const SpeakerSelectorComponent: JSXFunc<Props> = ({ devices }: Props) => {
  return (
    <div className={style.speakerSelector}>
      <div className={dialogStyle.itemLabel}>スピーカー</div>
      <DeviceSelectorComponent selectorId={SPEAKER_SELECT_TAG_ID} devices={devices} />
    </div>
  )
}
