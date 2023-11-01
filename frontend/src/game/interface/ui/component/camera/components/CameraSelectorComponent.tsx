import { JSXFunc } from '../../../util/domManager'
import dialogStyle from '../../settingDialog/style.module.scss'
import { DeviceSelectorComponent } from '../../voiceChat/components/DeviceSelectorComponent'
import { Camera } from '../../../../../domain/model/localDevice/camera'
import { CAMERA_SELECT_TAG_ID } from '../cameraSelector'
import style from './CameraSelectorComponent.module.scss'

interface Props {
  cameras: Camera[]
}

export const CameraSelectorComponent: JSXFunc<Props> = ({ cameras }: Props) => {
  return (
    <div className={style.cameraSelector}>
      <div className={dialogStyle.itemLabel}>カメラ</div>
      <DeviceSelectorComponent selectorId={CAMERA_SELECT_TAG_ID} devices={cameras} />
    </div>
  )
}
