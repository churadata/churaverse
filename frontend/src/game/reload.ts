import { Scene } from 'phaser'
import { Socket } from './socket'
import MainScene from './scene/main'
import { TabPanel } from './ui/tabPanel'

export class Reload extends TabPanel {
  scene: Scene
  private reloadButton!: Phaser.GameObjects.DOMElement

  public reloadPanelStatus: boolean = false
  private readonly socket!: Socket

  constructor(scene: Scene) {
    super(scene)
    this.scene = scene
  }

  public loadAssets(): void {
    this.scene.load.html('reloadform', 'assets/reloadform.html')
  }

  public CheckReloadPanelStatus(): void {
    if (this.reloadPanelStatus) {
      this.createReloadPanel()
    }
  }

  public createReloadPanel(): void {
    this.panelContainer = this.scene.add.container()
    this.reloadButton = this.scene.add
      .dom(0, 0)
      .createFromCache('reloadform')
      .setOrigin(0, 0)
      .setScrollFactor(0)
    this.panelContainer.add(this.reloadButton)
    this.panelContainer.visible = true
    this.reloadPanelStatus = true
    const send = document.getElementById('reload-button')
    if (send != null) {
      send.onclick = function () {
        window.location.reload()
      }
    }
  }

  /**
   * socket idが無くなった時にリロードさせる
   */
  public static socketOn(scene: Scene, socket: Socket): void {
    socket.singleOn('NotExistsPlayer', (mainScene: MainScene) => {
      mainScene.reload.CheckReloadPanelStatus()
    })
  }
}
