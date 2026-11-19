import type { IAdminSettingDialog } from '@churaverse/core-ui-plugin-client'
import { DomManager, type IEventBus, type IMainScene } from 'churaverse-engine-client'
import { ChangeMapEvent } from '../../event/changeMapEvent'
import { MapChangeFormComponent } from './components/MapChangeFormComponent'

// mapChangeFormのID
export const MAP_CHANGE_FORM_ID = 'mapSelector'

// MapSelectorComponentのID
export const MAP_NAME_LIST_ID = 'mapNames'

/**
 * マップの切り替え
 */
export class MapSelector {
  private readonly mapChangeFormContainer: HTMLElement | undefined

  public constructor(
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly mapIdAndDisplayName: Array<[string, string]>,
    adminSettingDialog: IAdminSettingDialog
  ) {
    const mapChangeForm = DomManager.addJsxDom(MapChangeFormComponent())
    this.mapChangeFormContainer = document.getElementById(MAP_CHANGE_FORM_ID) as HTMLElement

    if (this.mapChangeFormContainer == null) {
      throw new Error(`id:${MAP_CHANGE_FORM_ID}を持つelementが見つかりません。`)
    }

    adminSettingDialog.addContent('mapSetting', mapChangeForm)
    this.createMapSelector()
  }

  public updateSelected(mapId: string): void {
    const selectElement = document.getElementById(MAP_NAME_LIST_ID) as HTMLSelectElement
    selectElement.value = mapId
  }

  private createMapSelector(): void {
    const selectElement = document.getElementById(MAP_NAME_LIST_ID) as HTMLSelectElement
    if (selectElement === null) return
    this.mapIdAndDisplayName.forEach(([mapId, displayName]) => {
      const optionElement = document.createElement('option')
      optionElement.value = mapId
      optionElement.text = displayName
      selectElement.appendChild(optionElement)
    })
    this.addChangeEvent(selectElement)
  }

  private addChangeEvent(selectElement: HTMLSelectElement): void {
    selectElement.addEventListener('change', () => {
      const selectedElement = selectElement.value
      if (this.confirmMapChange()) {
        this.eventBus.post(new ChangeMapEvent(selectedElement))
      }
    })
  }

  private confirmMapChange(): boolean {
    return window.confirm('マップを変更しますか？')
  }
}
