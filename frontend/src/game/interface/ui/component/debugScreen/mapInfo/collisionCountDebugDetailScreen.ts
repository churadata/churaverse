import { DomManager } from '../../../domManager'
import { DebugDetailScreen } from '../debugDetailScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import { ICollisionCountDebugDetailScreen } from '../../../../../domain/IRender/IDebugRender/IMapInfoDebugDetailScreen'
import { MapManager } from '../../../../map/mapManager'

export class CollisionCountCountDebugDetailScreen implements ICollisionCountDebugDetailScreen {
  private content: HTMLElement

  public constructor(settingDialog: DebugDetailScreen, mapManager: MapManager) {
    // const collision = mapManager.maps.get('Collision')?.getLayerCellCount('Collision') ?? 'undefine'
    const collision = 'undefined'
    const element = `CollisionCount: ${collision}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    settingDialog.addContent('mapInfo', this.content)
  }

  public static build(mapManager: MapManager, settingDialog: DebugDetailScreen): CollisionCountCountDebugDetailScreen {
    return new CollisionCountCountDebugDetailScreen(settingDialog, mapManager)
  }

  public update(collision: number | undefined): void {
    this.content.textContent = `CollisionCount: ${collision ?? 'undefined'}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /CollisionCount: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
