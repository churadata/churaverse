import type { JSXFunc } from 'churaverse-engine-client'
import { CAMERA_EFFECT_IDS, type CameraEffectId } from '../../../interface/IVideoSender'
import {
  CAMERA_EFFECT_NAME_MAPPER,
  effectIdToElementId,
  imageSelectorButtonId,
  imageSelectorID,
  removeBackgroundImageButton,
} from '../defSection'
import style from './CameraEffectSelector.module.scss'

interface Props {
  readonly defaultMode: string
}

export const CameraEffectSelector: JSXFunc<Props> = ({ defaultMode }: Props) => {
  return (
    <div className={style.allBackGroundContainer}>
      <div className={style.allButtonsContainer}>
        {CAMERA_EFFECT_IDS.map((effectId) => {
          return RadioButton({
            effectId,
            checked: defaultMode === effectId,
          })
        })}
      </div>
      <div className={style.VBGImageSelector}>
        <VirtualBackgroundImageSelector />
      </div>
    </div>
  )
}

interface ButtonProps {
  effectId: CameraEffectId
  checked: boolean
}

const RadioButton: JSXFunc<ButtonProps> = ({ effectId, checked }: ButtonProps) => {
  return (
    <div key={effectId}>
      <input
        className={style.radioButton}
        type="radio"
        id={effectIdToElementId(effectId)}
        name="VideoEffector"
        value={effectId}
        defaultChecked={checked}
      />
      <label className={style.buttonLabel} htmlFor={effectIdToElementId(effectId)}>
        {CAMERA_EFFECT_NAME_MAPPER[effectId]}
      </label>
    </div>
  )
}

const VirtualBackgroundImageSelector: JSXFunc = () => {
  return (
    <>
      <div>
        <span>
          現在の選択ファイル:
          <br />
        </span>
        <img id="currentSelectedImage" height={100} />
        <p id="currentSelectedFile">未選択</p>
      </div>

      <div>
        <input type="file" accept="image/*" id={imageSelectorID} hidden={true} />
        <button id={imageSelectorButtonId} className={style.fileUploadButton}>
          ファイルを選択
        </button>
      </div>

      <button id={removeBackgroundImageButton} className={style.removeBackgroundImageButton}>
        画像を削除
      </button>
    </>
  )
}
