import { IKeyboardHelper } from './IKeyboardHelper'
import { IBombRenderFactory } from '../../../domain/IRenderFactory/IBombRenderFactory'
import { ISharkRenderFactory } from '../../../domain/IRenderFactory/ISharkRenderFactory'
import { IKeyboardController } from '../../../domain/IRender/IKeyboardController'
import { Interactor } from '../../../interactor/Interactor'
import { IKeyConfiguration } from '../../../interactor/IKeyConfiguration'
import { Direction } from '../../../domain/model/core/direction'
import { uniqueId } from '../../../domain/util/uniqueId'

/**
 * Keyboardの入力をInteractorに渡す
 * ロジックは書かない
 */
export class KeyboardController implements IKeyboardController {
  public constructor(
    private readonly interactor: Interactor,
    private readonly playerId: string,
    private readonly keyboardHelper: IKeyboardHelper,
    private readonly keyboardConfiguration: IKeyConfiguration,
    private readonly bombRenderFactory: IBombRenderFactory,
    private readonly sharkRenderFactory: ISharkRenderFactory
  ) {
    this.keyboardHelper.bindKey(
      'DropBomb',
      this.keyboardConfiguration.getKeyCode('DropBomb'),
      () => this.bombDrop(),
      320
    )
    this.keyboardHelper.bindKey(
      'ShotShark',
      this.keyboardConfiguration.getKeyCode('ShotShark'),
      () => this.sharkSpawn(),
      300
    )

    this.keyboardHelper.bindKey('EnterText', this.keyboardConfiguration.getKeyCode('EnterText'), () => this.sendChat())
    this.keyboardHelper.bindKey(
      'FocusShareScreen',
      this.keyboardConfiguration.getKeyCode('FocusShareScreen'),
      () => this.toggleScreenFocus(),
      null
    )

    this.keyboardHelper.bindKey('WalkDown', this.keyboardConfiguration.getKeyCode('WalkDown'), () =>
      this.playerWalkDown()
    )
    this.keyboardHelper.bindKey('WalkUp', this.keyboardConfiguration.getKeyCode('WalkUp'), () => this.playerWalkUp())
    this.keyboardHelper.bindKey('WalkLeft', this.keyboardConfiguration.getKeyCode('WalkLeft'), () =>
      this.playerWalkLeft()
    )
    this.keyboardHelper.bindKey('WalkRight', this.keyboardConfiguration.getKeyCode('WalkRight'), () =>
      this.playerWalkRight()
    )
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
