import type { JSXFunc } from 'churaverse-engine-client'
import { cameraVideosListId } from '../popUpScreenList'
import style from './VideoList.module.scss'

const ARROW_BUTTON_PATH = 'assets/webCamera/rightArrowButton.svg'

export const VideoList: JSXFunc = () => {
  return (
    <div id={cameraVideosListId} className={style.cameraVideosList}>
      <img src={ARROW_BUTTON_PATH} id="prevPageButton" className={`${style.pageButton} ${style.leftArrow}`} />
      <div id="videos" className={style.videos}></div>
      <img src={ARROW_BUTTON_PATH} id="nextPageButton" className={`${style.pageButton}`} />
    </div>
  )
}
