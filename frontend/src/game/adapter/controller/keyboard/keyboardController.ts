import { Direction } from '../../../domain/model/core/direction'
import { Interactor } from '../../../interactor/Interactor'
import { uniqueId } from '../../../domain/util/uniqueId'
import { IKeyboardController } from '../../../domain/IRender/IKeyboardController'
import { IKeyboardHelper } from './IKeyboardHelper'
import { IBombRenderFactory } from '../../../domain/IRenderFactory/IBombRenderFactory'
import { ISharkRenderFactory } from '../../../domain/IRenderFactory/ISharkRenderFactory'

/**
 * Keyboardの入力をInteractorに渡す
 * ロジックは書かない
 */
export class KeyboardController implements IKeyboardController {
  public constructor(
    private readonly interactor: Interactor,
    private readonly playerId: string,
    private readonly keyboardHelper: IKeyboardHelper,
    private readonly bombRenderFactory: IBombRenderFactory,
    private readonly sharkRenderFactory: ISharkRenderFactory
  ) {
    this.keyboardHelper.bindKey('Z', () => this.bombDrop(), 320)
    this.keyboardHelper.bindKey('X', () => this.sharkSpawn(), 300)
    this.keyboardHelper.bindKey('V', () => this.toggleScreenFocus(), null)

    this.keyboardHelper.bindKey('ENTER', () => this.sendChat(), null)

    this.keyboardHelper.bindKey('DOWN', () => this.playerWalkDown())
    this.keyboardHelper.bindKey('UP', () => this.playerWalkUp())
    this.keyboardHelper.bindKey('LEFT', () => this.playerWalkLeft())
    this.keyboardHelper.bindKey('RIGHT', () => this.playerWalkRight())
  }

  public update(time: number, delta: number): void {
    this.keyboardHelper.update(delta)
  }

  private playerWalkDown(): void {
    this.interactor.walkPlayer(this.playerId, Direction.down)
  }

  private playerWalkUp(): void {
    this.interactor.walkPlayer(this.playerId, Direction.up)
  }

  private playerWalkLeft(): void {
    this.interactor.walkPlayer(this.playerId, Direction.left)
  }

  private playerWalkRight(): void {
    this.interactor.walkPlayer(this.playerId, Direction.right)
  }

  private toggleScreenFocus(): void {
    this.interactor.toggleScreenFocus()
  }

  private bombDrop(): void {
    if (this.interactor.isPlayerDead(this.playerId)) return
    if (this.interactor.isTextInputting()) return
    void this.bombRenderFactory.build().then((render) => {
      this.interactor.dropBomb(uniqueId(), this.playerId, render)
    })
  }

  private sharkSpawn(): void {
    if (this.interactor.isPlayerDead(this.playerId)) return
    if (this.interactor.isTextInputting()) return
    void this.sharkRenderFactory.build().then((render) => {
      this.interactor.spawnShark(uniqueId(), this.playerId, render)
    })
  }

  private sendChat(): void {
    const message = this.interactor.getMessage()
    this.interactor.sendChat(this.playerId, message)
  }
}
