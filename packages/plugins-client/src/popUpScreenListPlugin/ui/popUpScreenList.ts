import { DomManager } from 'churaverse-engine-client'
import type { IPopUpScreenList } from './interface/IpopUpScreenList'
import { VideoCell } from './videoListRenderer/VideoCell'
import { VideoList } from './videoListRenderer/VideoList'

export const cameraVideosListId: string = 'cameraVideosList'

export class PopUpScreenList implements IPopUpScreenList {
  private currentPage = 0
  private readonly DISPLAY_SCREEN_COUNT = 3
  private readonly leftArrow: HTMLImageElement
  private readonly rightArrow: HTMLImageElement
  private readonly videos: HTMLDivElement
  private readonly availableVideos: Map<string, HTMLVideoElement>

  public constructor() {
    this.availableVideos = new Map<string, HTMLVideoElement>()
    DomManager.addJsxDom(VideoList())
    this.leftArrow = DomManager.getElementById('prevPageButton')
    this.rightArrow = DomManager.getElementById('nextPageButton')
    this.videos = DomManager.getElementById('videos')

    this.leftArrow.addEventListener('click', this.onClickPrevButton.bind(this))
    this.rightArrow.addEventListener('click', this.onClickNextButton.bind(this))

    this.updateList()
  }

  private hasNextPage(): boolean {
    return this.availableVideos.size > (this.currentPage + 1) * this.DISPLAY_SCREEN_COUNT
  }

  private hasPrevPage(): boolean {
    return this.currentPage > 0
  }

  private onClickPrevButton(): void {
    if (!this.hasPrevPage()) return
    this.currentPage--
    this.updateList()
  }

  private onClickNextButton(): void {
    if (!this.hasNextPage()) return
    this.currentPage++
    this.updateList()
  }

  /**
   * {id: string, screen: HTMLVideoElement}
   * */
  public addScreen(id: string, screen: HTMLVideoElement): void {
    this.availableVideos.set(id, screen)
    this.updateList()
  }

  /**
   * 表示している画面を削除する
   * @param {id: string}
   */
  public removeScreen(id: string): void {
    this.availableVideos.delete(id)
    this.updateList()
  }

  /**
   *
   * @param status true: 透明化する, false: 透明化を解除する
   */
  private transparentArrow(): void {
    if (!this.hasPrevPage()) this.leftArrow.style.opacity = '0'
    else this.leftArrow.style.opacity = '1'
    if (!this.hasNextPage()) this.rightArrow.style.opacity = '0'
    else this.rightArrow.style.opacity = '1'
  }

  /*
    ビデオの表示領域を描画する
    1. ビデオの表示領域を初期化する
    2. deterministicな順番でビデオを表示領域に追加する
  */
  private updateList(): void {
    // 初期化
    this.videos.innerHTML = ''

    // 画面に表示するビデオのリストを作成
    const streamArray = Array.from(this.availableVideos.values())

    this.transparentArrow()

    for (let screenIndex = 0; screenIndex < this.DISPLAY_SCREEN_COUNT; screenIndex++) {
      const stream = streamArray[this.currentPage * this.DISPLAY_SCREEN_COUNT + screenIndex]
      if (stream == null) continue
      const videoCell = VideoCell()
      const videoCellElement = DomManager.jsxToDom(videoCell)
      videoCellElement.appendChild(stream)
      this.videos.append(videoCellElement)
    }

    // this.currentPageが最後のページを超えている場合は1ページ戻る
    const firstScreenStreamIndex = this.currentPage * this.DISPLAY_SCREEN_COUNT
    if (firstScreenStreamIndex >= this.availableVideos.size && this.hasPrevPage()) {
      this.currentPage--
      this.updateList()
    }
  }
}
