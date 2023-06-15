import { Scene } from 'phaser'
import { Direction } from '../domain/model/core/direction'
import { uniqueId } from '../domain/util/uniqueId'
import { Interactor } from '../interactor/Interactor'
import { KeyboardHelper } from '../interface/keyboard/keyboardHelper'
import { BombRender } from '../interface/ui/Render/entity/bombRender'
import { SharkRender } from '../interface/ui/Render/entity/sharkRender'
import { Player } from '../domain/model/player'
import { Position } from '../domain/model/core/position'
import { IKeyboardController } from '../domain/IRender/IKeyboardController'

/**
 * 通信処理の遅延確認のためのテストコード
 * サメ、爆弾をそれぞれ100個ずつ生成し、通信が正常に行われているか確認する
 */
export class LoadTest implements IKeyboardController {
  public constructor(
    private readonly interactor: Interactor,
    private readonly scene: Scene,
    private readonly playerId: string,
    private readonly keyboardHelper: KeyboardHelper,
    private readonly ownPlayer: Player
  ) {
    this.keyboardHelper.bindKey('Z', () => this.bombPartyDrop(), 320)
    this.keyboardHelper.bindKey('X', () => this.sharkPartySpawn(), 300)

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

  private bombPartyDrop(): void {
    const NUMBER_OF_BOMB = 100
    const position = this.ownPlayer.position.copy()
    const startPos = this.ownPlayer.position.copy()
    for (let i = 0; i < NUMBER_OF_BOMB; i++) {
      void BombRender.build(this.scene).then((render) => {
        position.gridX = (i + 1) % 10
        position.gridY = Math.floor(i / 10)

        this.interactor.dropBomb(
          uniqueId(),
          this.playerId,
          render,
          new Position(startPos.x + position.x, startPos.y + position.y)
        )
      })
    }
  }

  private sharkPartySpawn(): void {
    const SHARK_TO_SHARK_SPACING = 40
    const SPACE_BETWEEN_ROWS = 80
    const NUMBER_OF_SHARK = 100
    const position = this.ownPlayer.position.copy()
    const startPos = this.ownPlayer.position.copy()
    const direction = this.ownPlayer.direction

    for (let i = 0; i < NUMBER_OF_SHARK; i++) {
      void SharkRender.build(this.scene).then((render) => {
        if (direction === Direction.up) {
          position.x -= SHARK_TO_SHARK_SPACING
          if (i % 10 === 0) {
            position.x = startPos.x
            position.y -= SPACE_BETWEEN_ROWS
          }
        } else if (direction === Direction.down) {
          position.x += SHARK_TO_SHARK_SPACING
          if (i % 10 === 0) {
            position.x = startPos.x
            position.y += SPACE_BETWEEN_ROWS
          }
        } else if (direction === Direction.left) {
          position.y -= SHARK_TO_SHARK_SPACING
          if (i % 10 === 0) {
            position.y = startPos.y
            position.x -= SPACE_BETWEEN_ROWS
          }
        } else {
          position.y += SHARK_TO_SHARK_SPACING
          if (i % 10 === 0) {
            position.y = startPos.y
            position.x += SPACE_BETWEEN_ROWS
          }
        }
        this.interactor.spawnShark(uniqueId(), this.playerId, render, position)
      })
    }
  }

  private sendChat(): void {
    const message = this.interactor.getMessage()
    this.interactor.sendChat(this.playerId, message)
  }
}
