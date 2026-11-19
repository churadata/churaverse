import type { JSXFunc } from 'churaverse-engine-client'
import style from './KickButtonComponent.module.scss'

interface KickButtonProps {
  iconPath: string
  visible: boolean
}

export const KickButtonComponent: JSXFunc<KickButtonProps> = ({ visible, iconPath }: KickButtonProps) => {
  const visibility = visible ? 'visible' : 'hidden'

  return <img className={style.icon} style={{ visibility }} src={iconPath}></img>
}
