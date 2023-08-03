import { Scene } from 'phaser'
import { CameraVideoRender } from './cameraVideoRender'
import { createUIContainer } from '../../util/container'
import { ICameraVideoListRender } from '../../../../domain/IRender/ICameraVideoListRender'

// const RIGHT_ARROW_BUTTON_PATH = 'assets/rightArrowButton.png'

/** カメラ映像+ページボタンのhtmlのキー名 */
const VIDEOS_CONTAINER_KEY = 'cameraVideoList'

/** カメラ映像+ページボタンのhtmlのパス */
const VIDEOS_CONTAINER_PATH = 'assets/webCamera/cameraVideosList.html'

/** カメラ映像を横並びにするdivのid */
const VIDEOS_CONTAINER_ID = 'videos'

const NEXT_PAGE_BUTTON_ID = 'nextPageButton'

const PREV_PAGE_BUTTON_ID = 'prevPageButton'

/**
 * 一度に表示する映像の最大数
 */
const DISPLAY_VIDEO_NUM = 3

export class CameraVideoListRender implements ICameraVideoListRender {
  /**
   * スクリーン, ボタンなど全要素をまとめるコンテナ
   */
  private readonly uiContainer: Phaser.GameObjects.Container
  private readonly cameraVideoListPhaserDOM: Phaser.GameObjects.DOMElement

  private nextPageButton?: HTMLImageElement
  private prevPageButton?: HTMLImageElement

  private readonly streams = new Map<string, MediaStream>()

  private currentPage: number = 0

  public static async build(scene: Scene): Promise<CameraVideoListRender> {
    // 初期状態のScreenを作成
    const screens: CameraVideoRender[] = []
    for (let i = 0; i < DISPLAY_VIDEO_NUM; i++) {
      const screen = await CameraVideoRender.build(scene)
      screens.push(screen)
    }

    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(VIDEOS_CONTAINER_KEY)) {
        resolve()
      }

      // カメラ映像表示部分+ページボタンの読み込み
      scene.load.html(VIDEOS_CONTAINER_KEY, VIDEOS_CONTAINER_PATH)

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new CameraVideoListRender(scene, screens)
    })
  }

  private constructor(private readonly scene: Scene, private readonly screens: CameraVideoRender[]) {
    this.uiContainer = createUIContainer(scene, 0, 1)

    this.cameraVideoListPhaserDOM = scene.add.dom(0, 0).createFromCache(VIDEOS_CONTAINER_KEY).setOrigin(0.5, 1)
    this.uiContainer.add(this.cameraVideoListPhaserDOM)

    this.setupScreens(screens)
    this.setupPageButtons()

    this.updateList()
  }

  private setupScreens(screens: CameraVideoRender[]): void {
    // スクリーンを横並びにするdivに追加していく
    const videosContainerElement = this.cameraVideoListPhaserDOM.getChildByID(VIDEOS_CONTAINER_ID)
    for (const screen of screens) {
      videosContainerElement.append(screen.getScreenContainer())
    }
  }

  /**
   * カメラ映像のページ切り替えボタンの設定
   */
  private setupPageButtons(): void {
    this.nextPageButton = this.cameraVideoListPhaserDOM.getChildByID(NEXT_PAGE_BUTTON_ID) as HTMLImageElement
    this.nextPageButton.addEventListener('mousedown', () => {
      this.onClickNextButton()
    })

    this.prevPageButton = this.cameraVideoListPhaserDOM.getChildByID(PREV_PAGE_BUTTON_ID) as HTMLImageElement
    this.prevPageButton.addEventListener('mousedown', () => {
      this.onClickPrevButton()
    })
  }

  private hasNextPage(): boolean {
    return this.streams.size > (this.currentPage + 1) * DISPLAY_VIDEO_NUM
  }

  private hasPrevPage(): boolean {
    return this.currentPage > 0
  }

  /**
   * NextButtonをクリックしたときの処理
   */
  private onClickNextButton(): void {
    if (!this.hasNextPage()) return

    // 次のページに進む
    this.currentPage++
    this.updateList()
  }

  /**
   * 前のページの映像を表示する
   */
  private onClickPrevButton(): void {
    if (!this.hasPrevPage()) return
    // 前のページにもどる
    this.currentPage--
    this.updateList()
  }

  /**
   * 映像をリストに追加する
   */
  public addVideo(id: string, stream: MediaStream): void {
    this.streams.set(id, stream)
    this.updateList()
  }

  /**
   * 映像をリストから削除する
   */
  public removeVideo(id: string): void {
    this.streams.delete(id)
    this.updateList()
  }

  /**
   * 表示されている映像を更新する
   * stream[currentPage]~stream[currentPage+DISPLAY_VIDEO_NUM]の映像を表示する
   */
  private updateList(): void {
    for (let screenIndex = 0; screenIndex < DISPLAY_VIDEO_NUM; screenIndex++) {
      const streamIndex = this.currentPage * DISPLAY_VIDEO_NUM + screenIndex

      if (streamIndex >= this.streams.size) {
        this.screens[screenIndex].video = undefined
      } else {
        // MapをArrayに変換
        const streams = Array.from(this.streams.values())
        this.screens[screenIndex].video = streams[streamIndex]
      }
    }

    this.updateNextButtonState()
    this.updatePrevButtonState()

    // 表示する映像が1つもない場合は非表示にする
    if (this.streams.size === 0) {
      this.uiContainer.setVisible(false)
    } else {
      this.uiContainer.setVisible(true)
    }

    // this.currentPageが最後のページを超えている場合は1ページ戻る
    const firstScreenStreamIndex = this.currentPage * DISPLAY_VIDEO_NUM
    if (firstScreenStreamIndex >= this.streams.size && this.hasPrevPage()) {
      this.currentPage--
      this.updateList()
    }
  }

  private updateNextButtonState(): void {
    if (this.nextPageButton === undefined) return

    if (this.hasNextPage()) {
      this.nextPageButton.style.opacity = '1'
    } else {
      this.nextPageButton.style.opacity = '0'
    }
  }

  private updatePrevButtonState(): void {
    if (this.prevPageButton === undefined) return

    if (this.hasPrevPage()) {
      this.prevPageButton.style.opacity = '1'
    } else {
      this.prevPageButton.style.opacity = '0'
    }
  }
}
