import dialogStyle from '@churaverse/core-ui-plugin-client/settingDialog/style.module.scss'
import type { JSXFunc } from 'churaverse-engine-client'
import { PLAYER_COLOR_NAMES, type PlayerColor } from '../../../types/playerColor'
import { PLAYER_COLOR_BUTTON_ID } from '../playerColorButtons'
import style from './PlayerColorButtonsComponent.module.scss'

interface Props {
  readonly defaultColor: PlayerColor
}

export const PlayerColorButtonsComponent: JSXFunc<Props> = ({ defaultColor }: Props) => {
  return (
    <div>
      <div className={dialogStyle.itemLabel}> 色を変更 </div>
      <div className={style.allButtonsContainer}>
        {PLAYER_COLOR_NAMES.map((colorName) => {
          return ColorButton({
            colorName,
            checked: colorName === defaultColor,
          })
        })}
      </div>
    </div>
  )
}

interface ButtonProps {
  colorName: PlayerColor
  checked: boolean
}

const ColorButton: JSXFunc<ButtonProps> = ({ colorName, checked }: ButtonProps) => {
  return (
    <div key={colorName}>
      <input
        className={style.colorButton}
        type="radio"
        id={PLAYER_COLOR_BUTTON_ID(colorName)}
        name="playerColorButton"
        defaultChecked={checked}
      />
      <label className={style.buttonLabel} htmlFor={PLAYER_COLOR_BUTTON_ID(colorName)}></label>
    </div>
  )
}
