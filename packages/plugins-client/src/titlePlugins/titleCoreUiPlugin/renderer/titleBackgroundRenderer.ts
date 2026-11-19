import type { Scene } from 'phaser'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TitleBackgroundRenderer {
  public constructor(scene: Scene) {
    scene.cameras.main.setBackgroundColor('0xEFEFEF')
  }
}
