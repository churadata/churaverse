import dialogStyle from '@churaverse/core-ui-plugin-client/dialog/style.module.scss'
import type { JSXFunc } from 'churaverse-engine-client'
import type { Camera } from '../../../domain/localDevice/camera'
import { CAMERA_SELECT_TAG_ID } from '../cameraSelector'
import style from './CameraSelectorComponent.module.scss'
import { DeviceSelectorComponent } from './DeviceSelectorComponent'

interface Props {
  devices: Camera[]
}

export const CameraSelectorComponent: JSXFunc<Props> = ({ devices }: Props) => {
  return (
    <div className={style.cameraSelector}>
      <div className={dialogStyle.itemLabel}>カメラ</div>
      <DeviceSelectorComponent selectorId={CAMERA_SELECT_TAG_ID} devices={devices} />
    </div>
  )
}
