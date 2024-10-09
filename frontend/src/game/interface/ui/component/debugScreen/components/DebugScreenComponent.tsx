import { JSXFunc } from 'churaverse-engine-client'
import style from './DebugScreenComponent.module.scss'
import { DEBUG_SCREEN_CONTAINER_ID } from '../debugScreenRender'

export const DebugScreenComponent: JSXFunc = () => {
  return <div className={style.container} id={DEBUG_SCREEN_CONTAINER_ID}></div>
}
