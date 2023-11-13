import { JSXFunc } from '../../../util/domManager'
import dialogStyle from '../../dialog/style.module.scss'
import style from '../../voiceChat/components/SpeakerSelectorComponent.module.scss'
import { MapSelectorComponent } from '../../settingDialog/components/MapSelectorComponent'
import { MAP_CHANGE_FORM_ID, MAP_NAME_LIST_ID } from '../mapSelector'

export const MapChangeFormComponent: JSXFunc = () => {
  return (
    <div className={style.apeakerSelector}>
      <div className={dialogStyle.itemLabel}> Map切り替え </div>
      <div className={style.speakerSelector}>{MapChangeForm()}</div>
    </div>
  )
}

const MapChangeForm: JSXFunc = () => {
  return (
    <div id={MAP_CHANGE_FORM_ID}>
      <MapSelectorComponent selectorId={MAP_NAME_LIST_ID} />
    </div>
  )
}
