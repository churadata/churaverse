import { DomManager } from 'churaverse-engine-client'
import { createRoot, type Root } from 'react-dom/client'
import type { IMaterialItemBoxContainer } from '../../interface/IMaterialItemBoxContainer'
import { MaterialItemBoxComponent } from './components/MaterialItemBoxComponent'

export class MaterialItemBoxContainer implements IMaterialItemBoxContainer {
  private readonly materialItemBoxContainerId = 'material-item-box-container'
  public element!: HTMLElement
  private root!: Root

  public initialize(): void {
    this.element = document.createElement('div')
    this.element.id = this.materialItemBoxContainerId
    DomManager.addDom(this.element)
    this.root = createRoot(this.element)
    this.updateMaterialItemBox([])
  }

  public show(): void {
    this.element.style.display = 'flex'
  }

  public hide(): void {
    this.element.style.display = 'none'
  }

  public updateMaterialItemBox(itemImageList: string[]): void {
    if (this.element === undefined) return
    this.root.render(<MaterialItemBoxComponent itemImagePaths={itemImageList} />)
  }

  public remove(): void {
    this.element.style.display = 'none'
    this.root.unmount()
  }
}
