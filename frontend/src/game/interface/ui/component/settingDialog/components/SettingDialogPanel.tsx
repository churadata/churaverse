import style from '../style.module.scss'
import { JSXFunc } from '../../../util/domManager'

export const SettingDialogPanel: JSXFunc = () => {
  return (
    <div className={style.container}>
      <div className={style.dialogLabel}>設定</div>
    </div>
  )
}
