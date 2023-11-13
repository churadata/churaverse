import style from '../style.module.scss'
import { JSXFunc } from '../../../util/domManager'
import { AbstractDOMLayerNames } from '../../../util/domLayer'

export interface Props {
  dialogName: string
  layer?: AbstractDOMLayerNames
}

export const DialogPanel: JSXFunc<Props> = (props: Props) => {
  return (
    <div className={style.container}>
      <div className={style.dialogLabel}>{props.dialogName}</div>
    </div>
  )
}
