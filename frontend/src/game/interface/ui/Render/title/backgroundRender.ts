import { Scene } from 'phaser'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class BackgroundRender {
  public constructor(scene: Scene) {
    scene.cameras.main.setBackgroundColor('0xEFEFEF')
  }

  public static async build(scene: Scene): Promise<BackgroundRender> {
    return await new Promise<BackgroundRender>((resolve) => {
      resolve(new BackgroundRender(scene))
    })
  }
}
