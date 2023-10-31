import { JSXFunc } from '../../../util/domManager'
import { DeviceSelectorComponent } from './DeviceSelectorComponent'
import dialogStyle from '../../settingDialog/style.module.scss'
import { Speaker } from '../../../../../domain/model/localDevice/speaker'
import { SPEAKER_SELECT_TAG_ID } from '../speakerSelector'
import style from './SpeakerSelectorComponent.module.scss'

interface Props {
  speakers: Speaker[]
}

export const SpeakerSelectorComponent: JSXFunc<Props> = ({ speakers }: Props) => {
  return (
    <div className={style.speakerSelector}>
      <div className={dialogStyle.itemLabel}>スピーカー</div>
      <DeviceSelectorComponent selectorId={SPEAKER_SELECT_TAG_ID} devices={speakers} />
    </div>
  )
}
