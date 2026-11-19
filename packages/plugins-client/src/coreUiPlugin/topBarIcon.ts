import { domLayerSetting } from 'churaverse-engine-client'
import type { ITopBarIconRenderer } from './interface/IDialogIconRenderer'

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
  /**
   * 数字が大きいほど左に配置される
   */
  order?: number
}

const DEFAULT_ICON_SIZE = '40px'
const DEFAULT_ICON_BACKGROUND_COLOR = 'rgba(255, 255, 255, 0.95)'
const DEFAULT_ICON_BORDER_RADIUS = '1.8px'
const DEFAULT_ICON_PADDING = '2.5px'

export abstract class TopBarIconRenderer implements ITopBarIconRenderer {
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
    order = 0,
  }: IconProps) {
    this.activeIconImgPath = activeIconImgPath
    this.inactiveIconImgPath = inactiveIconImgPath
    this.isActive = isActive

    const img = document.createElement('img')
    img.style.width = width
    img.style.height = height
    img.style.order = order.toString()

    img.addEventListener('click', () => {
      onClick(this.isActive)
    })

    this.imgElement = img
    domLayerSetting(this.imgElement, 'higher')

    /**
     * アイコンのstyleを設定する関数
     * 子クラスはこのメソッドをoverrideしてstyleをカスタムできる
     * メソッドの呼び出しはインスタンス作成時に自動的に行われる
     */
    this.applyIconStyle()

    this.isActive ? this.activate() : this.deactivate()
  }

  public get node(): HTMLElement {
    return this.imgElement
  }

  public get order(): number {
    return Number(this.imgElement.style.order)
  }

  /**
   * 数字が大きいほど左に配置される
   */
  public set order(value: number) {
    this.imgElement.style.order = value.toString()
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
    this.imgElement.style.opacity = '0.70'
    this.imgElement.src = this.inactiveIconImgPath
  }

  /**
   * アイコンのstyleを設定する関数
   * 子クラスはこのメソッドをoverrideしてstyleをカスタムできる
   * メソッドの呼び出しはインスタンス作成時に自動的に行われる
   */
  protected applyIconStyle(): void {
    this.imgElement.style.backgroundColor = DEFAULT_ICON_BACKGROUND_COLOR
    this.imgElement.style.borderRadius = DEFAULT_ICON_BORDER_RADIUS
    this.imgElement.style.padding = DEFAULT_ICON_PADDING
    this.imgElement.style.boxSizing = 'border-box'
    this.imgElement.style.cursor = 'pointer'
  }
}
