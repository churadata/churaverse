import { JSXFunc } from 'churaverse-engine-client'
import style from './DebugScreenComponent.module.scss'
import { DEBUG_DETAIL_SCREEN_CONTAINER_ID } from '../debugDetailScreenRender'

export const DebugDetailScreenComponent: JSXFunc = () => {
  return <div className={style.container} id={DEBUG_DETAIL_SCREEN_CONTAINER_ID}></div>
}
