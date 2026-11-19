import type { GameObjects } from 'phaser'

export interface ITitleArrowButtonRenderer {
  setParentContainer: (container: GameObjects.Container) => void
}
