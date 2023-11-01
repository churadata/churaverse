import { PLAYER_COLOR_NAMES, PlayerColorName } from '../../../../../domain/model/types'
import { JSXFunc } from '../../../util/domManager'
import { PLAYER_COLOR_BUTTON_ID } from '../playerColorButtons'
import dialogStyle from '../style.module.scss'
import style from './PlayerColorButtonsComponent.module.scss'

interface Props {
  readonly defaultColor: PlayerColorName
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
  colorName: PlayerColorName
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
