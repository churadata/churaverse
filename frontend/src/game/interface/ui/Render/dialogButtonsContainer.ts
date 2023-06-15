import { Scene } from 'phaser'
import { createUIContainer } from '../util/container'

export class DialogButtonsContainer {
  private readonly controlsContainer: Phaser.GameObjects.Container

  public constructor(scene: Scene) {
    this.controlsContainer = createUIContainer(scene, 1, 0)
  }

  // コンテナにボタンを追加する関数
  public addButton(button: Phaser.GameObjects.Image | Phaser.GameObjects.Container): void {
    this.controlsContainer.add(button)
  }
}
