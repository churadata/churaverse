import { JSXFunc } from 'churaverse-engine-client'
import dialogStyle from './style.module.scss'

interface Props {
  readonly element: string
}

export const ElementDebugScreenComponent: JSXFunc<Props> = ({ element }: Props) => {
  return <div className={dialogStyle.itemLabel}>{element}</div>
}
