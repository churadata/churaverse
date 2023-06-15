import { Scene } from 'phaser'
import { layerSetting } from './layer'

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
  layerSetting(container, 'UIContainer')

  scene.scale.on(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Phaser.Scale.Events.RESIZE,
    (
      gameSize: Phaser.Structs.Size,
      baseSize: Phaser.Structs.Size,
      displaySize: Phaser.Structs.Size,
      previousWidth: number,
      previousHeight: number
    ) => {
      if (container !== null) {
        // gameSize.width - margin - position
        container.setPosition(gameSize.width * originX + offsetX, gameSize.height * originY + offsetY)
      }
    }
  )
  return container
}
