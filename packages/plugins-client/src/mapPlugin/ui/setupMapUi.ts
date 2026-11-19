import { AdminSettingSection } from '@churaverse/core-ui-plugin-client'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import type { MapManager } from '../mapManager'
import { MapSelector } from './mapSelector/mapSelector'
import '@churaverse/core-ui-plugin-client'

export function setupMapUi(
  store: Store<IMainScene>,
  eventBus: IEventBus<IMainScene>,
  mapManager: MapManager
): MapSelector {
  const uiStore = store.of('coreUiPlugin')
  uiStore.adminSettingDialog.addSection(new AdminSettingSection('mapSetting', 'マップ設定'))

  const mapIdAndDisplayName: Array<[string, string]> = mapManager.mapIds.map((id) => {
    return [id, mapManager.getMapConfigInfo(id).displayName]
  })

  return new MapSelector(eventBus, mapIdAndDisplayName, uiStore.adminSettingDialog)
}
