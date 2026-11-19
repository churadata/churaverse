import { DomManager } from 'churaverse-engine-client'
import { createRoot, type Root } from 'react-dom/client'
import type { IAlchemyItemBoxContainer } from '../../interface/IAlchemyItemBoxContainer'
import { AlchemyItemBoxComponent } from './components/AlchemyItemBoxComponent'

export class AlchemyItemBoxContainer implements IAlchemyItemBoxContainer {
  private readonly alchemyItemBoxContainerId: string = 'alchemy-item-box-container'
  public element!: HTMLElement
  private root!: Root

  public initialize(): void {
    this.element = document.createElement('div')
    this.element.id = this.alchemyItemBoxContainerId
    DomManager.addDom(this.element)
    this.root = createRoot(this.element)
    this.updateAlchemyItemBox('')
  }

  public show(): void {
    this.element.style.display = 'flex'
  }

  public hide(): void {
    this.element.style.display = 'none'
  }

  public updateAlchemyItemBox(itemImage: string): void {
    if (this.element === undefined) return
    this.root.render(<AlchemyItemBoxComponent item={itemImage} />)
  }

  public remove(): void {
    this.element.style.display = 'none'
    this.root.unmount()
  }
}
