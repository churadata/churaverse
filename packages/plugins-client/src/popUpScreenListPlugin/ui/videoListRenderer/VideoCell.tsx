import type { JSXFunc } from 'churaverse-engine-client'
import style from './VideoCell.module.scss'

export const VideoCell: JSXFunc = () => {
  return <div className={style.webCameraVideo}></div>
}
