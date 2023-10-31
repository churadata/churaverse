import { ITopBarIconRender } from '../../../../interactor/IDialogIconRender'
import { domLayerSetting } from '../../util/domLayer'

/**
 * Iconをクリックしたときに発火される関数
 * @param isActive クリックする直前のIconの状態
 */
export type OnClickCallback = (isActive: boolean) => void

export interface IconProps {
  activeIconImgPath: string
  inactiveIconImgPath: string
  onClick: OnClickCallback
  width?: string
  height?: string
  isActive?: boolean
}

const DEFAULT_ICON_SIZE = '40px'

export abstract class TopBarIconRender implements ITopBarIconRender {
  protected readonly imgElement: HTMLImageElement
  private readonly activeIconImgPath: string
  private readonly inactiveIconImgPath: string
  private isActive: boolean

  public constructor({
    activeIconImgPath,
    inactiveIconImgPath,
    onClick,
    width = DEFAULT_ICON_SIZE,
    height = DEFAULT_ICON_SIZE,
    isActive = true,
  }: IconProps) {
    this.activeIconImgPath = activeIconImgPath
    this.inactiveIconImgPath = inactiveIconImgPath
    this.isActive = isActive

    const img = document.createElement('img')
    img.style.width = width
    img.style.height = height

    img.addEventListener('click', () => {
      onClick(this.isActive)
    })

    this.imgElement = img
    domLayerSetting(this.imgElement, 'higher')

    this.isActive ? this.activate() : this.deactivate()
  }

  public get node(): HTMLElement {
    return this.imgElement
  }

  /**
   * アイコンの画像をactiveIconImgPathにして不透明にする
   */
  public activate(): void {
    this.isActive = true
    this.imgElement.style.opacity = '1'
    this.imgElement.src = this.activeIconImgPath
  }

  /**
   * アイコンの画像をinactiveIconImgPathにして半透明にする
   */
  public deactivate(): void {
    this.isActive = false
    this.imgElement.style.opacity = '0.5'
    this.imgElement.src = this.inactiveIconImgPath
  }
}
