import { JSXFunc } from '../../../util/domManager'
import dialogStyle from '../../dialog/style.module.scss'
import style from './InvincibleWorldModeSwitch.module.scss'

interface SwitchProps {
  checked: boolean
}

export const InvincibleWorldModeSwitchComponent: JSXFunc<SwitchProps> = ({ checked }: SwitchProps) => {
  return (
    <div className={style.body}>
      <div className={dialogStyle.invincibleSwitchStyle}> 無敵モード切り替え </div>
      <InvincibleSwitch checked={checked} />
    </div>
  )
}

const InvincibleSwitch: JSXFunc<SwitchProps> = ({ checked }: SwitchProps) => {
  return (
    <div key={'invincibleWorldMode'}>
      <switch></switch>
      <input
        className={style.invincibleSwitchInput}
        type="checkbox"
        id={'switchInvincibleWorldMode'}
        name="InvincibleWorldModeSwitch"
        defaultChecked={checked}
      />
      <label className={style.invincibleSwitchLabel} htmlFor={'switchInvincibleWorldMode'}></label>
    </div>
  )
}
