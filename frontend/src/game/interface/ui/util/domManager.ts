/* eslint-disable @typescript-eslint/no-extraneous-class */
import ReactDOMServer from 'react-dom/server'
import { UINotFoundError } from '../errors/uiNotFoundError'
import { UIContainerNotFoundError } from '../errors/uiContainerNotFoundError'

export type JSXFunc<Props = undefined> = Props extends undefined ? JSXNoArgFunc : (props: Props) => JSX.Element

type JSXNoArgFunc = () => JSX.Element

type CSSPosition = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky' | 'inherit' | 'initial' | 'revert' | 'unset'

export class DomManager {
  private static uiContainer: HTMLElement | null = null

  public static setUiContainer(): void {
    DomManager.uiContainer = document.getElementById('uiContainer')
  }

  /**
   * 引数で受け取ったDOM要素をuiContainerの子要素として追加する
   */
  public static addDom(el: HTMLElement, position: CSSPosition = 'fixed'): void {
    if (this.uiContainer === null) {
      throw new UIContainerNotFoundError()
    }

    el.style.position = position
    this.uiContainer.appendChild(el)
  }

  /**
   * JSX.Elementを元にDOMを作成し, uiContainerの子要素として追加する
   * @returns 追加したDOM要素
   */
  public static addJsxDom(jsxElement: JSX.Element): HTMLElement {
    if (this.uiContainer === null) {
      throw new UIContainerNotFoundError()
    }

    const element = this.jsxToDom(jsxElement)
    this.uiContainer.appendChild(element)

    return element
  }

  /**
   * JSX.Elementを元にDOMを作成する. 作成のみでuiContainerには追加されない
   */
  public static jsxToDom(jsxElement: JSX.Element): HTMLElement {
    if (this.uiContainer === null) {
      throw new UIContainerNotFoundError()
    }

    const div = document.createElement('div')
    const htmlStr = ReactDOMServer.renderToString(jsxElement)
    div.innerHTML = htmlStr
    const element = div.firstElementChild

    if (element === null) throw Error('element is null')
    if (!(element instanceof HTMLElement)) throw Error('HTMLElementではない要素')
    return element
  }

  /**
   * idで指定したHTMLElementを取得する. 存在しないidを指定した場合はエラー
   * @param id
   * @returns
   */
  public static getElementById<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id)

    if (el === null) throw new UINotFoundError(id)
    return el as T
  }

  /**
   * uiContainerの子要素を全て削除
   */
  public static removeAll(): void {
    if (this.uiContainer === null) {
      throw new UIContainerNotFoundError()
    }

    this.uiContainer.innerHTML = ''
  }
}
