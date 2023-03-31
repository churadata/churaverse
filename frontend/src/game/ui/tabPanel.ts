import { Scene } from 'phaser'

export class TabPanel {
  scene: Scene
  public panelContainer!: Phaser.GameObjects.Container
  public iconImage!: Phaser.GameObjects.Image

  constructor(scene: Scene) {
    this.scene = scene
  }

  public closeContainer(): void {
    this.panelContainer.visible = false
    this.iconImage.setAlpha(0.5)
  }
}
