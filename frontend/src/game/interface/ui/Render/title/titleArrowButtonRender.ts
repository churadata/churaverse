import Phaser, { Scene } from 'phaser'
import { PLAYER_COLOR_NAMES, PlayerColorName } from '../../../../domain/model/types'
import { TitleInteractor } from '../../../../interactor/titleInteractor'
import { ITitleArrowButtonRender } from '../../../../domain/IRender/ITitleArrowButtonRender'

const ARROW_BUTTON_FILES = {
  right: 'assets/playerColorChangeButton/arrow_right.png',
  left: 'assets/playerColorChangeButton/arrow_left.png',
}

const ARROW_BUTTON_KEYS = {
  right: 'right',
  left: 'left',
}

export class TitleArrowButtonRender implements ITitleArrowButtonRender {
  private interactor?: TitleInteractor
  private readonly playerId: string
  private readonly rightArrow: Phaser.GameObjects.Image
  private readonly leftArrow: Phaser.GameObjects.Image

  private constructor(scene: Scene, playerId: string) {
    this.playerId = playerId

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
  }

  public static async build(scene: Scene, playerId: string): Promise<TitleArrowButtonRender> {
    return await new Promise<void>((resolve) => {
      scene.load.image(ARROW_BUTTON_KEYS.right, ARROW_BUTTON_FILES.right)
      scene.load.image(ARROW_BUTTON_KEYS.left, ARROW_BUTTON_FILES.left)

      scene.load.once('complete', () => {
        resolve()
      })

      scene.load.start()
    }).then(() => {
      return new TitleArrowButtonRender(scene, playerId)
    })
  }

  public addToContainer(container: Phaser.GameObjects.Container): void {
    container.add(this.leftArrow)
    container.add(this.rightArrow)
  }

  public setInteractor(interactor: TitleInteractor): void {
    this.interactor = interactor

    this.rightArrow.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
      const nextColor = this.findNextColor(interactor.currentPlayerColor)
      interactor.changePlayerColor(this.playerId, nextColor)
    })
    this.leftArrow.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
      const previousColor = this.findPreviousColor(interactor.currentPlayerColor)
      interactor.changePlayerColor(this.playerId, previousColor)
    })
  }

  public findNextColor(currentPlayerColor: PlayerColorName): PlayerColorName {
    const currentIndex = PLAYER_COLOR_NAMES.findIndex((element) => element === currentPlayerColor)
    return PLAYER_COLOR_NAMES[(currentIndex + 1) % PLAYER_COLOR_NAMES.length]
  }

  public findPreviousColor(currentPlayerColor: PlayerColorName): PlayerColorName {
    const currentIndex = PLAYER_COLOR_NAMES.findIndex((element) => element === currentPlayerColor)
    return PLAYER_COLOR_NAMES[currentIndex === 0 ? PLAYER_COLOR_NAMES.length - 1 : currentIndex - 1]
  }
}
