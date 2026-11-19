import type { Scene } from 'phaser'
import { layerSetting } from './canvasLayer'

/**
 * 画面のリサイズに追従して位置を更新するコンテナを作成する
 */
export function createUIContainer(
  scene: Scene,
  originX: number,
  originY: number,
  offsetX = 0,
  offsetY = 0
): Phaser.GameObjects.Container {
  const container = scene.add
    .container(scene.scale.gameSize.width * originX + offsetX, scene.scale.gameSize.height * originY + offsetY)
    .setScrollFactor(0)
  layerSetting(container, 'UI')

  scene.scale.on(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Phaser.Scale.Events.RESIZE,
    (
      gameSize: Phaser.Structs.Size,
      _baseSize: Phaser.Structs.Size,
      _displaySize: Phaser.Structs.Size,
      _previousWidth: number,
      _previousHeight: number
    ) => {
      if (container !== null) {
        // gameSize.width - margin - position
        container.setPosition(gameSize.width * originX + offsetX, gameSize.height * originY + offsetY)
      }
    }
  )
  return container
}
