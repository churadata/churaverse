import { Scene } from 'phaser'
import { IBadge } from '../../domain/IRender/IBadge'
import { layerSetting } from '../../layer'

export class Badge implements IBadge {
  private readonly graphics: Phaser.GameObjects.Graphics
  private readonly container: Phaser.GameObjects.Container

  public constructor(scene: Scene) {
    // graphicsは移動させるのが手間なのでcontainerに入れて操作する
    this.container = scene.add.container(0, 0)

    this.graphics = scene.add.graphics().fillStyle(0xffffff, 1).setScrollFactor(0).fillCircle(0, 0, 7) // .fillCircle(12, -10, 7)
    this.container.add(this.graphics)
    this.graphics.setVisible(false)
    layerSetting(this.graphics, 'badge')
  }

  public static async build(scene: Scene): Promise<Badge> {
    return await new Promise<void>((resolve) => {
      resolve()
    }).then(() => {
      return new Badge(scene)
    })
  }

  public activate(): void {
    this.graphics.setVisible(true)
  }

  public deactivate(): void {
    this.graphics.setVisible(false)
  }

  public getGraphicsContainer(): Phaser.GameObjects.Container {
    return this.container
  }

  public moveTo(x: number, y: number): void {
    this.container.setPosition(x, y)
  }
}
