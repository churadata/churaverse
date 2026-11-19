import { PLAYER_COLOR_NAMES, type PlayerColor } from '@churaverse/player-plugin-client'
import type { IEventBus, ITitleScene, Store } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import arrowLeftImage from '../../assets/arrow_left.png'
import arrowRightImage from '../../assets/arrow_right.png'
import type { ITitleArrowButtonRenderer } from '../../domain/ITitleArrowButtonRenderer'
import { TitlePlayerColorChangeEvent } from '../../event/titlePlayerColorChangeEvent'
import type { TitlePlayerPluginStore } from '../../store/defTitlePlayerPlugin'

const ARROW_BUTTON_KEYS = {
  right: 'right_arrow_button',
  left: 'left_arrow_button',
}

export class TitleArrowButtonRenderer implements ITitleArrowButtonRenderer {
  private readonly titlePlayerPluginStore!: TitlePlayerPluginStore
  private readonly rightArrow: Phaser.GameObjects.Image
  private readonly leftArrow: Phaser.GameObjects.Image

  public constructor(
    scene: Scene,
    store: Store<ITitleScene>,
    private readonly eventbus: IEventBus<ITitleScene>
  ) {
    this.titlePlayerPluginStore = store.of('titlePlayerPlugin')

    this.rightArrow = scene.add
      .image(45, 0, ARROW_BUTTON_KEYS.right)
      .setDisplaySize(45, 35)
      .setAlpha(1)
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        this.rightArrow.setAlpha(0.5)
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.rightArrow.setAlpha(1)
      })

    this.leftArrow = scene.add
      .image(-45, 0, ARROW_BUTTON_KEYS.left)
      .setDisplaySize(45, 35)
      .setAlpha(1)
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        this.leftArrow.setAlpha(0.5)
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.leftArrow.setAlpha(1)
      })

    // 矢印クリック時の動作を定義
    this.setClickArrow()
  }

  public static loadAssets(scene: Scene): void {
    scene.load.image(ARROW_BUTTON_KEYS.right, arrowRightImage)
    scene.load.image(ARROW_BUTTON_KEYS.left, arrowLeftImage)
  }

  public setParentContainer(container: Phaser.GameObjects.Container): void {
    container.add(this.leftArrow)
    container.add(this.rightArrow)
  }

  private setClickArrow(): void {
    this.rightArrow.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
      const currentPlayerColor = this.titlePlayerPluginStore.ownPlayer.color
      const nextColor = this.findNextColor(currentPlayerColor)
      const playerColorChangeEvent = new TitlePlayerColorChangeEvent(nextColor)
      this.eventbus.post(playerColorChangeEvent)
    })
    this.leftArrow.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
      const currentPlayerColor = this.titlePlayerPluginStore.ownPlayer.color
      const previousColor = this.findPreviousColor(currentPlayerColor)
      const playerColorChangeEvent = new TitlePlayerColorChangeEvent(previousColor)
      this.eventbus.post(playerColorChangeEvent)
    })
  }

  private findNextColor(currentPlayerColor: PlayerColor): PlayerColor {
    const currentIndex = PLAYER_COLOR_NAMES.indexOf(currentPlayerColor)
    return PLAYER_COLOR_NAMES[(currentIndex + 1) % PLAYER_COLOR_NAMES.length]
  }

  private findPreviousColor(currentPlayerColor: PlayerColor): PlayerColor {
    const currentIndex = PLAYER_COLOR_NAMES.indexOf(currentPlayerColor)
    return PLAYER_COLOR_NAMES[currentIndex === 0 ? PLAYER_COLOR_NAMES.length - 1 : currentIndex - 1]
  }
}
