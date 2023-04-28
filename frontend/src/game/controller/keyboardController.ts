import { Scene } from 'phaser'
import { Direction } from '../domain/direction'
import { Interactor } from '../interactor/Interactor'
import { uniqueId } from '../domain/util/uniqueId'
import { BombRender } from '../ui/Render/bombRender'
import { SharkRender } from '../ui/Render/sharkRender'
import { KeyboardHelper } from '../interface/keyboard/keyboardHelper'
import { IKeyboardController } from '../domain/IRender/IKeyboardController'

/**
 * Keyboardの入力をInteractorに渡す
 * ロジックは書かない
 */
export class KeyboardController implements IKeyboardController {
  public constructor(
    private readonly interactor: Interactor,
    private readonly scene: Scene,
    private readonly playerId: string,
    private readonly keyboardHelper: KeyboardHelper
  ) {
    this.keyboardHelper.bindKey('Z', () => this.bombDrop(), 320)
    this.keyboardHelper.bindKey('X', () => this.sharkSpawn(), 300)

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

  private bombDrop(): void {
    if (this.interactor.isPlayerDead(this.playerId)) return
    if (this.interactor.isTextInputting()) return
    void BombRender.build(this.scene).then((render) => {
      this.interactor.dropBomb(uniqueId(), this.playerId, render)
    })
  }

  private sharkSpawn(): void {
    if (this.interactor.isPlayerDead(this.playerId)) return
    if (this.interactor.isTextInputting()) return
    void SharkRender.build(this.scene).then((render) => {
      this.interactor.spawnShark(uniqueId(), this.playerId, render)
    })
  }

  private sendChat(): void {
    const message = this.interactor.getMessage()
    this.interactor.sendChat(this.playerId, message)
  }
}
