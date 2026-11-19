import dialogStyle from '@churaverse/core-ui-plugin-client/dialog/style.module.scss'
import type { JSXFunc } from 'churaverse-engine-client'
import { MAP_CHANGE_FORM_ID, MAP_NAME_LIST_ID } from '../mapSelector'
import style from './MapChangeFormComponent.module.scss'
import { MapSelectorComponent } from './MapSelectorComponent'

export const MapChangeFormComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <div className={dialogStyle.itemLabel}> Map切り替え </div>
      <div className={style.mapSelector}>{MapChangeForm()}</div>
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
