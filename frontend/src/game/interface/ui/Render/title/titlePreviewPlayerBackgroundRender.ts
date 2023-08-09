import { GameObjects, Scene } from 'phaser'
import { createUIContainer } from '../../util/container'
import { ITitlePlayerBackgroundContainerRender } from '../../../../domain/IRender/ITitlePlayerBackgroundContainerRender'

/*
 * Player Render を描画するには背景として Tilemaps.TilemapLayer を用意する必要がある
 */
export class TitlePlayerBackgroundContainerRender implements ITitlePlayerBackgroundContainerRender {
  public container: GameObjects.Container

  private constructor(public scene: Scene) {
    this.container = createUIContainer(scene, 0.5, 0.5, -5)
  }

  public static async build(scene: Scene): Promise<TitlePlayerBackgroundContainerRender> {
    return await new Promise<TitlePlayerBackgroundContainerRender>((resolve) => {
      resolve(new TitlePlayerBackgroundContainerRender(scene))
    })
  }
}
