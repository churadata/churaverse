import { Scene } from 'phaser'
import { TabPanel } from './tabPanel'

export class ButtonsManager {
  scene: Scene
  public static openedPanel?: TabPanel
  static openPanelControl: any

  constructor(scene: Scene) {
    this.scene = scene
  }

  public openPanel(openingPanel: TabPanel): void {
    if (ButtonsManager.openedPanel !== undefined) {
      ButtonsManager.openedPanel.closeContainer()
    }
    ButtonsManager.openedPanel = openingPanel
  }
}
