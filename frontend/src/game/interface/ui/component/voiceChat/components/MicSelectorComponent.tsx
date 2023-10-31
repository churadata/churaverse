import { Microphone } from '../../../../../domain/model/localDevice/microphone'
import { JSXFunc } from '../../../util/domManager'
import { MIC_SELECT_TAG_ID } from '../micSelector'
import { DeviceSelectorComponent } from './DeviceSelectorComponent'
import dialogStyle from '../../settingDialog/style.module.scss'
import style from './MicSelectorComponent.module.scss'

interface Props {
  microphones: Microphone[]
}

export const MicSelectorComponent: JSXFunc<Props> = ({ microphones }: Props) => {
  return (
    <div className={style.micSelector}>
      <div className={dialogStyle.itemLabel}>マイク</div>
      <DeviceSelectorComponent selectorId={MIC_SELECT_TAG_ID} devices={microphones} />
    </div>
  )
}
