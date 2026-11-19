import { DomManager, type IMainScene, type Store } from 'churaverse-engine-client'
import { createRoot, type Root } from 'react-dom/client'
import type { IGhostPlayerListUi } from '../../interface/IGhostPlayerListUi'
import { GhostPlayerListComponent } from './components/GhostPlayerListComponent'

export class GhostPlayerListUi implements IGhostPlayerListUi {
  private readonly ghostPlayerListContainerId = 'churaren-game-ghost-player-list'
  private element: HTMLElement | undefined
  private root: Root | undefined

  public constructor(private readonly store: Store<IMainScene>) {}

  public initialize(): void {
    this.element = document.createElement('div')
    this.element.id = this.ghostPlayerListContainerId
    DomManager.addDom(this.element)
    this.root = createRoot(this.element)
    this.show()
  }

  public show(): void {
    this.element!.style.display = 'flex'
  }

  public updateGhostPlayerList(playerNames: string[]): void {
    if (this.root === undefined) return
    this.root.render(<GhostPlayerListComponent playerNames={playerNames} />)
  }

  public remove(): void {
    this.root?.unmount()
    this.element?.remove()
    this.element = undefined
    this.root = undefined
  }
}
