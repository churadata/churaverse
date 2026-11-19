import dialogStyle from '@churaverse/core-ui-plugin-client/settingDialog/style.module.scss'
import type { JSXFunc } from 'churaverse-engine-client'
import type { Microphone } from '../../../domain/localDevice/microphone'
import { MIC_SELECT_TAG_ID } from '../micSelector'
import { DeviceSelectorComponent } from './DeviceSelectorComponent'
import style from './MicSelectorComponent.module.scss'

interface Props {
  devices: Microphone[]
}

export const MicSelectorComponent: JSXFunc<Props> = ({ devices }: Props) => {
  return (
    <div className={style.micSelector}>
      <div className={dialogStyle.itemLabel}>マイク</div>
      <DeviceSelectorComponent selectorId={MIC_SELECT_TAG_ID} devices={devices} />
    </div>
  )
}
