import { JSXFunc } from '../../../util/domManager'
import style from './MapSelectorComponent.module.scss'

interface Props {
  selectorId: string
}

export const MapSelectorComponent: JSXFunc<Props> = ({ selectorId }: Props) => {
  return <select className={style.mapSelector} id={selectorId}></select>
}
