import type { JSXFunc } from 'churaverse-engine-client'
import { SYNCHRO_BREAK_DESCRIPTION_TEXT_ID } from '../descriptionWindow'
import style from './DescriptionWindowComponent.module.scss'

interface DescriptionWindowProps {
  description: string
}

export const DescriptionWindowComponent: JSXFunc<DescriptionWindowProps> = ({
  description,
}: DescriptionWindowProps) => {
  return (
    <div className={style.container}>
      <p id={SYNCHRO_BREAK_DESCRIPTION_TEXT_ID}>{description}</p>
    </div>
  )
}
