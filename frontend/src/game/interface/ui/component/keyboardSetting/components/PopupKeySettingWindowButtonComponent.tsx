import { JSXFunc } from '../../../util/domManager'
import { POPUP_KEY_SETTING_WINDOW_BUTTON_ID } from '../popUpKeySettingWindowButton'
import style from './PopupKeySettingWindowButtonComponent.module.scss'

export const PopupKeySettingWindowButtonComponent: JSXFunc = () => {
  return (
    <button className={style.popupButton} type="button" id={POPUP_KEY_SETTING_WINDOW_BUTTON_ID}>
      キーバインドを変更
    </button>
  )
}
