import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'
import { Player } from '../../../../domain/model/player'
import { IMapSelector } from '../../../../domain/IRender/IMapSelector'
import { WorldConfig } from '../../../../domain/model/worldConfig'
import { AdminSettingDialog } from './adminSettingDialog'
import { WorldMap } from '../../../../domain/model/worldMap'

// mapChangeForm.htmlのキー
const MAP_CHANGE_FORM_KEY = 'mapChangeForm'

// mapChangeForm.htmlまでのパス
const MAP_CHANGE_FORM_PATH = 'assets/mapChangeForm.html'

// mapChangeFormのID
const MAP_CHANGE_FORM_ID = 'mapSelector'

/**
 * マップの切り替え
 */
export class MapSelector implements IMapSelector {
  private interactor?: Interactor
  private readonly mapChangeFormContainer: HTMLElement

  private constructor(
    private readonly scene: Scene,
    private readonly worldConfig: WorldConfig,
    private readonly maps: Map<string, WorldMap>,
    ownPlayer: Player,
    adminSettingDialog: AdminSettingDialog
  ) {
    const mapChangeForm = this.scene.add
      .dom(-305, 20)
      .createFromCache(MAP_CHANGE_FORM_KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0)
    this.mapChangeFormContainer = document.getElementById(MAP_CHANGE_FORM_ID) as HTMLElement

    if (this.mapChangeFormContainer == null) {
      throw new Error(`id:${MAP_CHANGE_FORM_ID}を持つelementが見つかりません。`)
    }

    // 管理者権限があるplayerにのみダイアログを表示
    if (this.hasPermission(ownPlayer)) {
      adminSettingDialog.add(mapChangeForm)
      this.createMapSelector()
    }
  }

  public static async build(
    scene: Scene,
    worldConfig: WorldConfig,
    maps: Map<string, WorldMap>,
    player: Player,
    adminSettingDialog: AdminSettingDialog
  ): Promise<MapSelector> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(MAP_CHANGE_FORM_KEY)) {
        resolve()
      }

      scene.load.html(MAP_CHANGE_FORM_KEY, MAP_CHANGE_FORM_PATH)

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new MapSelector(scene, worldConfig, maps, player, adminSettingDialog)
    })
  }

  public initialMap(mapName: string): void {
    const selectElement = document.getElementById('mapNames') as HTMLSelectElement
    selectElement.value = mapName
  }

  private createMapSelector(): void {
    const selectElement = document.getElementById('mapNames') as HTMLSelectElement
    if (selectElement === null) return
    this.maps.forEach((map, mapName) => {
      const optionElement = document.createElement('option')
      optionElement.value = map.mapJson
      optionElement.text = mapName
      selectElement.appendChild(optionElement)
    })
    this.addChangeEvent(selectElement)
  }

  private addChangeEvent(selectElement: HTMLSelectElement): void {
    selectElement.addEventListener('change', () => {
      const selectedElement = selectElement.value
      if (this.confirmMapChange()) {
        this.interactor?.changeMap(selectedElement)
      } else {
        selectElement.value = this.worldConfig.currentMap
      }
    })
  }

  private hasPermission(player: Player): boolean {
    if (player.role === 'admin') {
      return true
    } else {
      return false
    }
  }

  private confirmMapChange(): boolean {
    return window.confirm('マップを変更しますか？')
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}
